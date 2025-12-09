// src/tests/validation.test.js
// AI가 제안한 이메일 유효성 검사 테스트 케이스

/**
 * 이메일 형식을 검증하는 함수 (AI Generated)
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 테스트 시나리오
console.log("Testing Email Validation:");
console.log(validateEmail("test@example.com")); // Expected: true
console.log(validateEmail("invalid-email"));    // Expected: false
console.log(validateEmail("user@domain"));      // Expected: false (missing TLD)

// 엣지 케이스 식별
console.log(validateEmail(""));                 // Expected: false (Empty)
console.log(validateEmail("user@.com"));        // Expected: false (Dot placement)