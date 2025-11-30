module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: [
      "./features/step-definitions/**/*.ts",  
      "./features/hooks/**/*.ts"              
    ],
    format: ["progress", "html:report/cucumber-report.html"],
    timeout: 100000, 
  }
};
