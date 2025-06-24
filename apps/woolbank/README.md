
## local 환경 설정 가이드

해당 서비스에서는 로그인 데이터에 대한 정보를 cookie를 사용하여 관리합니다.
때문에 로컬 환경에서도 cookie 공유를 위해 `https` 설정이 필요합니다. (사용포트 443, 4200)

### vhost 세팅
도메인 등록을 위해 `localhost` 와 `bank-local.woolta.com` 의 도메인 vhost를 세팅합니다.

### local-ssl-proxy 적용
로컬에서의 ssl 사용을 위해 `local-ssl-proxy` 을 적용합니다.

우선 아래와 같이 글로벌 설치를 진행합니다. (기호에 따라 설치안하고 npx로 처리해도 무방합니다.)
 > npm install -g local-ssl-proxy

이후 아래의 스크립트를 실행하여 FE local 4200번 포트를 ssl 433포트에 할당처리 합니다.  
 > local-ssl-proxy --source 433 --target 4200

### 프로젝트 기동

아래의 nx 실행 명령을 통해 실행한 이후 `https://bank-local.woolta.com:433/` 링크를 통해 진입하면 정상 동작에 성공합니다.

> npx nx serve woolbank 



