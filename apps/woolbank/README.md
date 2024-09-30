
## local 환경 설정 가이드
cookie 공유를 위해 `https` 설정이 필요합니다. (사용포트 443, 4200)

1. `localhost` 와 `bank-local.woolta.com` 의 도메인 vhost를 세팅합니다.
2. 프로덕트 최상위 경로로 이동 합니다.
3. 아래의 명령어를 실행하여 https 와 http 의 세팅을 진행합니다.

> npx local-ssl-proxy --key cert/bank-local.woolta.com+2-key.pem --cert cert/bank-local.woolta.com+2.pem --source 443 --target 4200

4. 이후 `npx nx serve woolbank` 스크립트를 통해 local 프로덕트를 기동합니다.

