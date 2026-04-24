# 마스터홍 판매신호 확장 MVP 설계

마스터홍 판매신호는 사용자가 직접 연 네이버 상품 페이지에서 공개 판매신호, 리뷰 수, 관심고객수, 가격 정보를 감지하고 마스터홍 판매신호 분석기로 전달하는 Chrome 확장 프로그램입니다.

영문 표기: Master Hong

## 목표

서버 `fetch`와 Playwright headless 렌더링은 네이버 상품 상세 페이지에서 HTTP 429로 제한될 수 있습니다. 따라서 마스터홍 판매신호는 사용자의 브라우저에서 직접 열린 공개 페이지를 읽는 방식으로 동작합니다.

마스터홍은 네이버 공식 판매량 API를 사용한다고 표현하지 않습니다. 확장은 공개 페이지에서 감지한 판매신호 후보와 정규화 값을 전달합니다.

## 지원 페이지

- `https://smartstore.naver.com/*`
- `https://brand.naver.com/*`
- `https://search.shopping.naver.com/*`
- `https://shopping.naver.com/*`
- `https://m.smartstore.naver.com/*`
- `https://msearch.shopping.naver.com/*`

## 폴더 구조

```text
what-is-score/extension/
  manifest.json
  content.js
  popup.html
  popup.js
  styles.css
  README.md
```

## Manifest 기준

- Manifest V3
- 확장 이름: `마스터홍 판매신호`
- short_name: `마스터홍`
- permissions: `activeTab`, `scripting`
- host_permissions: 네이버 쇼핑, 스마트스토어, 브랜드스토어 도메인만 허용

## 데이터 모델

소비자용 웹앱 전달 payload는 아래 필드만 포함합니다.

```json
{
  "schemaVersion": 2,
  "source": "chrome-extension",
  "currentUrl": "https://smartstore.naver.com/donomall/products/2419380777",
  "collectedAt": "2026-04-24T13:00:00.000Z",
  "productId": "2419380777",
  "normalizedSignals": {
    "saleCount": 1131,
    "reviewCount": 301,
    "interestCustomerCount": 19483,
    "price": 98800,
    "originalPrice": 122400,
    "productId": "2419380777",
    "productTitle": "상품명 후보",
    "storeName": "스토어명 후보",
    "confidence": "high"
  }
}
```

`detectedSignals`, `bodyTextPreview`, `scriptJsonCandidates`는 디버그용이며 소비자용 전송 payload에는 포함하지 않습니다.

## content.js 흐름

1. 사용자가 버튼을 누른 현재 탭에 최신 `content.js`를 주입합니다.
2. `document.body.innerText`, meta 태그, script 텍스트를 읽습니다.
3. URL과 script에서 `productId`, `catalogId` 후보를 추출합니다.
4. script 키 기반으로 `saleCount`, `totalReviewCount`, `reviewAmount.totalReviewCount`, `discountedSalePrice`를 우선 추출합니다.
5. body 텍스트에서 `301건 리뷰`, `관심고객수 19,483`, `상품 가격 98,800원` 같은 공개 문구를 보조 추출합니다.
6. 도착확률, 배송비, 사업자번호, 고객센터 번호, order 순서값, 평점, 이미지 번호, 할인율 오탐을 제외합니다.
7. `normalizedSignals`를 생성해 팝업으로 반환합니다.

## popup 흐름

- `이 상품 분석하기`: 현재 탭을 분석한 뒤 payload를 base64url로 인코딩해 마스터홍 웹앱을 새 탭으로 엽니다.
- `현재 탭 분석`: 현재 탭의 정규화 신호를 팝업에서 미리 봅니다.
- `마스터홍에서 결과 보기`: 최근 분석 결과를 웹앱으로 엽니다.
- 개발자용 도구: JSON 복사와 원본 후보 보기를 접기 영역에 둡니다.

## 웹앱 연동

웹앱은 `?signal=base64urlEncodedJson` 파라미터를 읽어 JSON을 복원합니다. 복원한 `normalizedSignals`는 localStorage에 productId별 기록으로 저장됩니다.

## 성공 기준

- 네이버 상품 페이지에서 확장 버튼 클릭만으로 마스터홍 웹앱이 열립니다.
- 웹앱에 상품명, 스토어명, 판매신호, 리뷰 수, 관심고객수, 현재가, 정가 후보, 할인율이 표시됩니다.
- 같은 productId 기록이 2개 이상이면 이전 기록 대비 변화량이 표시됩니다.
