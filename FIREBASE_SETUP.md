# FINE.B Firebase setup

프로젝트: `finebpkg`

## 현재 사용 범위
현재 웹사이트는 **Firestore만 사용**합니다.

- `quotes` : 견적 요청
- `samples` : 샘플 제작 요청
- `inquiries` : 제작 문의

첨부파일 업로드는 사용하지 않습니다. 디자인·도면·참고이미지 등은 `whales84@naver.com`으로 받습니다.

## 1. Firestore Database 활성화
Firebase Console → **Firestore Database** → 데이터베이스 만들기.

생성 후 저장소의 `firestore.rules` 내용을 Firebase Console의 **Rules** 탭에 붙여넣고 게시합니다.

컬렉션은 첫 요청이 들어오면 자동으로 만들어집니다.

- `quotes`
- `samples`
- `inquiries`

## 2. 현재 Firestore Rules 구조
공개 홈페이지에서는 새 요청을 **생성(create)** 할 수 있습니다.

개인정보 보호를 위해 웹 클라이언트에서 Firestore 요청 목록을 공개 조회하거나 수정하는 것은 차단합니다.

따라서 `admin.html`은 로그인 없이 열리는 임시 운영화면이지만, **같은 브라우저의 localStorage 테스트 데이터만 표시**합니다.

전체 실제 접수 데이터는 Firebase Console → Firestore Database에서 확인합니다.

> 고객 이름, 연락처, 이메일을 로그인 없는 공개 admin.html에서 직접 조회하게 만들려면 Firestore 공개 read 권한이 필요하며, 이는 개인정보가 외부에 노출될 수 있어 적용하지 않습니다.

## 3. 파일 전달
웹사이트에는 첨부파일 필드가 없습니다.

다음 자료는 이메일로 받습니다.

- AI / PDF 디자인 파일
- 전개도
- 제품 이미지
- 참고 패키지
- 기타 제작 참고자료

이메일: `whales84@naver.com`

## 4. 현재 웹앱 연결
Firebase 설정은 `assets/js/firebase-client.js`에 적용되어 있습니다.

- Firestore 저장: 사용
- Firebase Storage: 사용 안 함
- Firebase Authentication: 사용 안 함
- 공개 Admin 로그인: 없음

## 5. 체크 순서
1. Firestore Database 생성
2. `firestore.rules` 게시
3. 견적내기 테스트 접수
4. 샘플제작 테스트 접수
5. 제작문의 테스트 접수
6. Firebase Console에서 `quotes`, `samples`, `inquiries` 생성 여부 확인

## 추후 중앙 관리자 조회가 필요할 때
실제 고객 접수 목록을 `admin.html`에서 중앙 조회하려면 관리자 인증 또는 별도 서버 권한 처리가 필요합니다. 그 단계에서 Firebase Authentication을 추가하면 현재 관리자 UI를 그대로 활용할 수 있습니다.
