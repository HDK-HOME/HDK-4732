# Codex 작업지시서 — 마스터홍 판매신호 확장/웹앱 정리

## 현재 목표
프로젝트 폴더명은 `what-is-score` 그대로 유지하되, 사이트/확장/문서/화면 표기는 `마스터홍 / Master Hong` 기준으로 리브랜딩한다.

서비스명: 마스터홍
도구명: 판매신호 분석기
확장명: 마스터홍 판매신호

## 0. 로고 적용
첨부된 SVG를 기준으로 확장 아이콘과 웹앱 로고를 적용한다.

사용 파일:
- `masterhong-wordmark-main.svg` : 웹앱/랜딩/문서용 메인 워드마크
- `masterhong-extension-icon.svg` : 크롬 확장 아이콘 원본

해야 할 일:
1. 프로젝트에 `public/brand/` 또는 적절한 asset 폴더를 만든다.
2. 위 SVG 2개를 넣는다.
3. 확장 프로그램용 PNG 아이콘을 생성한다.
   - `icons/icon16.png`
   - `icons/icon32.png`
   - `icons/icon48.png`
   - `icons/icon128.png`
4. `manifest.json`의 `icons`, `action.default_icon`에 위 PNG 파일을 연결한다.
5. 웹앱 상단/결과 카드/빈 상태 화면에 `마스터홍` 브랜드 표기를 적용한다.

주의:
- 앱 내부 경로가 깨지지 않도록 기존 폴더명 `what-is-score`는 바꾸지 않는다.
- 사용자 노출 문구만 `마스터홍`으로 바꾼다.

## 1. manifest 리브랜딩
`manifest.json`을 아래 방향으로 정리한다.

```json
{
  "manifest_version": 3,
  "name": "마스터홍 판매신호",
  "version": "0.1.0",
  "description": "네이버 스마트스토어 상품의 공개 판매신호를 분석하고 기록하는 셀러용 도구입니다.",
  "permissions": ["activeTab", "scripting"],
  "host_permissions": ["https://smartstore.naver.com/*"],
  "action": {
    "default_title": "마스터홍 판매신호",
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

## 2. 가격 추출 보정
현재 문제:
- `price`가 할인 전 가격 `122400`으로 잡힌다.

원하는 결과:
- `price`: 현재 판매가 `98800`
- `originalPrice`: 할인 전 가격 `122400`
- `discountRate`: `19`

작업 방식:
1. 네이버 상품 페이지 DOM/body/script 전체에서 가격 후보를 수집한다.
2. 할인율 패턴 `%` 또는 `discountRate`가 있으면 할인율을 별도 추출한다.
3. 가격 후보가 2개 이상이고 할인율이 있으면:
   - 낮은 가격을 `price`
   - 높은 가격을 `originalPrice`
   - 할인율을 `discountRate`
4. 할인율이 없고 가격이 1개면:
   - 해당 값을 `price`
   - `originalPrice`, `discountRate`는 `null`
5. 숫자는 문자열이 아니라 number로 저장한다.

반드시 최종 normalizedSignals 구조는 아래처럼 맞춘다.

```js
{
  productId: "2419380777",
  productTitle: "도노 가정용 전기난로 오방난로 바퀴형 : 도노몰",
  storeName: "도노몰",
  saleCount: 1131,
  reviewCount: 301,
  interestCustomerCount: 19483,
  price: 98800,
  originalPrice: 122400,
  discountRate: 19,
  confidence: "high",
  collectedAt: new Date().toISOString()
}
```

## 3. 확장 → 웹앱 자동 전달 흐름
기존 JSON 붙여넣기 방식은 폐기한다.

원하는 UX:
1. 사용자가 네이버 스마트스토어 상품 페이지 접속
2. 크롬 확장 아이콘 클릭
3. 팝업에서 `이 상품 분석하기` 클릭
4. content script가 현재 페이지에서 `normalizedSignals` 추출
5. 추출 데이터를 `base64url`로 인코딩
6. 새 탭으로 마스터홍 웹앱 오픈
7. URL 예시:

```txt
https://hdk-001.benywade31.workers.dev/?signal=BASE64URL_DATA
```

또는 현재 프로젝트의 실제 배포 URL을 사용한다.

웹앱에서는:
1. `URLSearchParams`로 `signal` 파라미터 확인
2. base64url decode
3. JSON parse
4. 결과 카드 자동 표시
5. localStorage에 기록 저장
6. URL에서 signal 파라미터는 가능하면 제거하거나, 민감하지 않은 상태로 유지한다.

## 4. localStorage 기록 저장
상품별 기록 키:

```js
const key = `masterhong:signals:${storeName}:${productId}`;
```

저장 구조:

```js
{
  productId,
  productTitle,
  storeName,
  records: [
    {
      date: "2026-04-24",
      saleCount: 1131,
      reviewCount: 301,
      interestCustomerCount: 19483,
      price: 98800,
      originalPrice: 122400,
      discountRate: 19,
      collectedAt: "2026-04-24T..."
    }
  ]
}
```

중복 저장 방지:
- 같은 날짜에 같은 상품을 여러 번 분석하면 새 records를 무한히 추가하지 말고, 오늘 기록을 최신 값으로 업데이트한다.

## 5. 3일/7일 변화량 표시
결과 카드에 아래를 표시한다.

- 오늘 판매수
- 오늘 리뷰수
- 오늘 관심고객수
- 현재 판매가
- 할인 전 가격
- 할인율
- 3일 판매 변화량
- 7일 판매 변화량
- 3일 리뷰 변화량
- 7일 리뷰 변화량
- 데이터 부족 시: `데이터 축적 중`

계산 방식:
- 현재 기록에서 3일 전 또는 7일 전과 가장 가까운 과거 기록을 찾는다.
- 해당 기록이 없으면 `null` 반환.
- 값이 있으면 현재값 - 과거값으로 변화량 계산.

## 6. 베타테스터용 안내문 생성
프로젝트 루트 또는 docs에 `BETA_INSTALL_GUIDE.md` 생성.

내용:
1. ZIP 압축 해제
2. Chrome 주소창에 `chrome://extensions` 입력
3. 우측 상단 개발자 모드 ON
4. `압축해제된 확장 프로그램 로드` 클릭
5. extension 폴더 선택
6. 네이버 상품 페이지 접속
7. 확장 아이콘 클릭
8. `이 상품 분석하기` 클릭
9. 마스터홍 웹앱에서 결과 확인

## 7. 개인정보처리방침 초안 생성
`privacy.html` 또는 `public/privacy.html` 생성.

핵심 문구:
- 마스터홍 판매신호는 사용자의 개인정보를 수집하지 않는다.
- 사용자가 직접 접속한 네이버 스마트스토어 상품 페이지의 공개 상품 정보만 분석한다.
- 상품명, 스토어명, 상품 ID, 판매수, 리뷰수, 관심고객수, 가격, 할인율이 브라우저 localStorage에 저장될 수 있다.
- 이름, 이메일, 연락처, 결제정보, 로그인 정보는 수집하지 않는다.
- 별도 외부 서버로 개인정보를 전송하지 않는다.

## 8. 테스트 명령/체크리스트
작업 후 아래를 확인한다.

테스트 URL:
`https://smartstore.naver.com/donomall/products/2419380777`

기대값:
- saleCount: 1131 또는 현재 페이지 기준 최신 값
- reviewCount: 301 또는 현재 페이지 기준 최신 값
- interestCustomerCount: 19483 또는 현재 페이지 기준 최신 값
- productId: 2419380777
- productTitle: 도노 가정용 전기난로 오방난로 바퀴형 : 도노몰
- storeName: 도노몰
- price: 98800
- originalPrice: 122400
- discountRate: 19
- confidence: high

주의:
- 수치는 네이버 페이지 상태에 따라 변할 수 있으므로 구조와 필드 정확성을 우선 확인한다.

## 9. 완료 후 보고 형식
작업이 끝나면 아래 형식으로 보고한다.

```txt
완료한 작업:
1. ...
2. ...
3. ...

수정한 파일:
- ...

테스트 결과:
- ...

남은 이슈:
- ...
```
