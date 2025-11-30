export function generateTempEmail() {
    const random = Math.floor(Math.random() * 1000000);
    return `testuser${random}@mailinator.com`;
  }
  
  export function generateTempPassword() {
    return "CrazyTester456!!";
  }