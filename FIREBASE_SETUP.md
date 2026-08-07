# FINE.B Firebase setup

프로젝트: `finebpkg`

## 1. Firestore Database 활성화
Firebase Console → **Firestore Database** → 데이터베이스 만들기.

- 운영 모드로 생성 권장
- 생성 후 저장소의 `firestore.rules` 내용을 **Rules** 탭에 붙여넣고 게시

컬렉션은 웹에서 첫 요청이 들어오면 자동 생성됩니다.

- `quotes`
- `samples`
- `inquiries`
- `admins`

## 2. 관리자 로그인 활성화
Firebase Console → **Authentication** → Sign-in method → **Email/Password** 활성화.

Authentication → Users에서 관리자 계정 1개를 생성합니다.

생성한 사용자의 **UID**를 복사한 뒤 Firestore에서 아래 문서를 직접 만듭니다.

- Collection: `admins`
- Document ID: `관리자 UID`
- Field: `active` / boolean / `true`
- Field: `email` / string / `관리자 이메일`

`admin.html`은 이 문서가 존재하고 `active: true`인 계정만 접근할 수 있습니다.

## 3. GitHub Pages 도메인 허용
Firebase Console → Authentication → Settings → Authorized domains에 아래 도메인을 추가합니다.

`jyhome1228-cyber.github.io`

나중에 독립 도메인을 연결하면 해당 도메인도 추가합니다.

## 4. Cloud Storage
첨부파일을 Firebase에 직접 올리려면 Firebase 프로젝트가 **Blaze 요금제**여야 합니다.

Storage → Get started로 기본 버킷을 만든 뒤 저장소의 `storage.rules` 내용을 Rules 탭에 붙여넣고 게시합니다.

Storage를 아직 활성화하지 않아도 견적/샘플/제작문의 본문은 Firestore에 저장되도록 구현되어 있습니다. 첨부가 실패한 경우에는 `whales84@naver.com`으로 파일을 받는 방식으로 운영할 수 있습니다.

## 5. 현재 웹앱 연결
Firebase 설정은 `assets/js/firebase-client.js`에 적용되어 있습니다.

- Firestore: 견적 / 샘플 / 제작문의
- Storage: 10MB 이하 첨부파일
- Authentication: 관리자 로그인
- Admin: `admin.html`

## 6. 배포 전 체크
- Firestore Rules 게시
- Authentication Email/Password 활성화
- 관리자 계정 생성
- `admins/{uid}` 문서 생성
- Authorized domains 추가
- Storage 사용 시 Blaze + Storage Rules 게시

## 보안 추가 권장
실서비스 오픈 후에는 Firebase App Check를 추가해 자동화된 비정상 요청을 줄이는 것을 권장합니다.
