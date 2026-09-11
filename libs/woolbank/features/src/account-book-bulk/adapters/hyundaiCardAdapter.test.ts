import { hyundaiCardAdapter } from './hyundaiCardAdapter';
import { parseStatement, UnsupportedStatementError } from './registry';

const buildStatement = (rows: string[]) => `
<html><body><table>
<tr><th>실시간 이용내역</th></tr>
<tr><th>승인일</th><th>승인시각</th><th>카드구분</th><th>카드종류</th><th>가맹점명</th><th>승인금액</th><th>이용구분</th><th>할부개월</th><th>승인번호</th><th>취소일</th><th>승인구분</th></tr>
${rows.join('\n')}
</table></body></html>`;

/** 컬럼 11개짜리 데이터 행 */
const row = ({
  date = '2026년 09월 11일',
  time = '16:55',
  merchant = '쿠팡_쿠페이 - 쿠팡',
  amount = '4,100',
  usage = '일시불',
  installment = '0',
  approvalNo = '00992915',
  canceledAt = '-',
  approvalType = '승인',
} = {}) =>
  `<tr><td>${date}</td><td>${time}</td><td>본인</td><td>4***-****-****-880*</td><td>${merchant}</td><td>${amount}</td><td>${usage}</td><td>${installment}</td><td>${approvalNo}</td><td>${canceledAt}</td><td>${approvalType}</td></tr>`;

describe('hyundaiCardAdapter 테스트', () => {
  describe('canParse 테스트', () => {
    it('헤더 문구가 모두 있는 HTML 내역서면 처리할 수 있다고 판정한다.', () => {
      // Given
      const text = buildStatement([row()]);

      // When
      // Then
      expect(hyundaiCardAdapter.canParse({ fileName: 'anything.xls', text })).toBe(true);
    });

    it('파일명이 현대카드처럼 보여도 내용이 다르면 거절한다.', () => {
      // Given
      const text = '<html><body><table><tr><td>다른 카드사</td></tr></table></body></html>';

      // When
      // Then
      expect(hyundaiCardAdapter.canParse({ fileName: 'hyundaicard_2026.xls', text })).toBe(false);
    });
  });

  describe('parse 테스트', () => {
    it('날짜·가맹점·금액을 정제해 반환한다.', () => {
      // Given
      const text = buildStatement([row({ date: '2026년 09월 01일', merchant: '스타벅스코리아', amount: '1,400' })]);

      // When
      const { rows } = hyundaiCardAdapter.parse({ fileName: 'x.xls', text });

      // Then
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        date: '2026-09-01',
        merchant: '스타벅스코리아',
        amount: 1400,
        type: 'EXPENDITURE',
      });
    });

    it('취소 내역은 제외하고 사유와 건수를 알려준다.', () => {
      // Given
      const text = buildStatement([
        row({ merchant: '정상거래' }),
        row({ merchant: '취소거래', canceledAt: '2026년 09월 06일', approvalType: '취소' }),
      ]);

      // When
      const { rows, skipped } = hyundaiCardAdapter.parse({ fileName: 'x.xls', text });

      // Then
      expect(rows.map((r) => r.merchant)).toEqual(['정상거래']);
      expect(skipped).toContainEqual({ reason: '취소된 내역', count: 1 });
    });

    it('전표접수도 정상 승인으로 취급한다. (대부분의 행이 이 상태다)', () => {
      // Given
      const text = buildStatement([row({ approvalType: '전표접수' })]);

      // When
      const { rows } = hyundaiCardAdapter.parse({ fileName: 'x.xls', text });

      // Then
      expect(rows).toHaveLength(1);
    });

    it('금액을 읽을 수 없는 행은 버리고 사유를 알려준다.', () => {
      // Given
      const text = buildStatement([row({ amount: '-' })]);

      // When
      const { rows, skipped } = hyundaiCardAdapter.parse({ fileName: 'x.xls', text });

      // Then
      expect(rows).toHaveLength(0);
      expect(skipped).toContainEqual({ reason: '금액·가맹점을 읽을 수 없는 행', count: 1 });
    });

    it('할부 개월수가 있으면 참고 정보에 표기한다.', () => {
      // Given
      const text = buildStatement([row({ usage: '할부', installment: '3' })]);

      // When
      const { rows } = hyundaiCardAdapter.parse({ fileName: 'x.xls', text });

      // Then
      expect(rows[0].note).toContain('3개월 할부');
    });

    it('과거 → 현재 순서로 뒤집어 반환한다. (원본은 최신순)', () => {
      // Given
      const text = buildStatement([
        row({ date: '2026년 09월 11일', merchant: '최신' }),
        row({ date: '2026년 09월 01일', merchant: '과거' }),
      ]);

      // When
      const { rows } = hyundaiCardAdapter.parse({ fileName: 'x.xls', text });

      // Then
      expect(rows.map((r) => r.merchant)).toEqual(['과거', '최신']);
    });

    it('sourceKey 는 같은 입력에 대해 안정적이다.', () => {
      // Given
      const text = buildStatement([row()]);

      // When
      const first = hyundaiCardAdapter.parse({ fileName: 'x.xls', text }).rows[0].sourceKey;
      const second = hyundaiCardAdapter.parse({ fileName: 'x.xls', text }).rows[0].sourceKey;

      // Then
      expect(first).toBe(second);
    });
  });
});

describe('parseStatement 테스트', () => {
  it('내용에 맞는 어댑터를 골라 파싱한다.', () => {
    // Given
    const text = buildStatement([row()]);

    // When
    const { adapter, rows } = parseStatement({ fileName: 'x.xls', text });

    // Then
    expect(adapter.id).toBe('hyundai-card');
    expect(rows).toHaveLength(1);
  });

  it('지원하는 어댑터가 없으면 전용 에러를 던진다.', () => {
    // Given
    const text = '<html><body>알 수 없는 형식</body></html>';

    // When
    // Then
    expect(() => parseStatement({ fileName: 'x.xls', text })).toThrow(UnsupportedStatementError);
  });
});
