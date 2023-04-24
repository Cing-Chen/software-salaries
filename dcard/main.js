const employeeList = [];
const employee = {
  timestamp: '', // 回應時間
  companyName: '', // 公司名稱
  nothing: '', // 空
  position: '', // 職務
  jobLevel: '', // 職級
  relevantExperience: '', // 相關年資
  currentTenure: '', // 現職年資
  monthlyBaseSalary: '', // 月底薪(萬)
  monthlyBonus: '', // Bonus (月)
  totalAnnualCompensation: '', // 總年薪(萬) 分紅+年終+底薪
  dailyAverageWorkingHours: '', // 每日平均工時
  monthlyOvertime: '', // 每月加班
  overtimeFrequency: '', // 加班頻率
  jobSatisfaction: '', // 爽度(1~5) 5最爽
  loading: '', // Loading
  supplement: '', // 補充
};

const dcard = document.querySelectorAll('tbody > tr');

dcard.forEach((tr, index) => {
  if (index < 2) return;
  const ths = tr.querySelectorAll('td');
  ths.forEach((th, index) => {
    let key = Object.keys(employee)[index];
    let text = th.textContent;
    if (key === undefined) return;
    employee[key] =
      key === 'supplement' ? text.replace(/^[\n\s]+|[\n\s]+$/g, '') : text;

    employee[key] =
      !!+employee[key] || employee[key] === '0'
        ? +employee[key]
        : employee[key];
  });
  employeeList.push(JSON.parse(JSON.stringify(employee)));
});
console.log(JSON.stringify(employeeList));
