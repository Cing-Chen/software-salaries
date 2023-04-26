import { salaryOptions, annualOptions } from './model.js';

const { ref, onMounted } = Vue;

const base =
  window.location.hostname === 'zhong1016.github.io'
    ? 'https://raw.githubusercontent.com/zhong1016/software-salaries/master/api'
    : '../api';

const onGet = async (api) => fetch(base + api).then((r) => r.json());

const getEmployee = async () => onGet('/employee.json');
const getEmployeeLazy = async () => onGet('/employee_lazy.json');
const getCompany = async () => onGet('/company.json');

const filters = {
  company: (e, company) => e.companyName === company,
  salary: {
    1: (e) => e.monthlyBaseSalary < 5,
    2: (e) => e.monthlyBaseSalary >= 5 && e.monthlyBaseSalary < 10,
    3: (e) => e.monthlyBaseSalary >= 10,
  },
  annual: {
    1: (e) => e.totalAnnualCompensation < 50,
    2: (e) =>
      e.totalAnnualCompensation >= 50 && e.totalAnnualCompensation < 100,
    3: (e) =>
      e.totalAnnualCompensation >= 100 && e.totalAnnualCompensation < 150,
    4: (e) =>
      e.totalAnnualCompensation >= 150 && e.totalAnnualCompensation < 200,
    5: (e) => e.totalAnnualCompensation >= 200,
  },
};

const App = {
  setup() {
    const loading = ref(true);
    const employee = ref([]);
    const employeeClone = ref([]);
    const companyOptions = ref([]);
    const companyValue = ref('');
    const salaryValue = ref('');
    const annualValue = ref('');
    const tableRefPC = ref(null);
    const tableRefMobile = ref(null);

    const filterEmployee = (
      emp,
      { company = '', salary = '', annual = '' }
    ) => {
      let filteredEmp = emp;

      if (company)
        filteredEmp = filteredEmp.filter((e) => filters.company(e, company));

      if (salary) filteredEmp = filteredEmp.filter(filters.salary[salary]);

      if (annual) filteredEmp = filteredEmp.filter(filters.annual[annual]);

      tableRefPC.value.setScrollTop(0);
      tableRefMobile.value.setScrollTop(0);
      return filteredEmp;
    };

    const onChange = async ({ company = '', salary = '', annual = '' }) => {
      [companyValue.value, salaryValue.value, annualValue.value] = [
        company,
        salary,
        annual,
      ];

      if (!employeeClone.value.length) {
        employeeClone.value = [...employee.value];
      }

      employee.value = filterEmployee(employeeClone.value, {
        company,
        salary,
        annual,
      });
    };

    const init = async () => {
      try {
        companyOptions.value = await getCompany();
        employee.value = await getEmployeeLazy();
      } finally {
        loading.value = false;
      }
    };

    init();
    onMounted(() => {
      setTimeout(async () => {
        let res = await getEmployee();
        employee.value = res;
      }, 1000);
    });
    return {
      employee,
      companyValue,
      companyOptions,
      salaryValue,
      salaryOptions,
      annualValue,
      annualOptions,
      loading,
      tableRefPC,
      tableRefMobile,
      onChange,
    };
  },
};

export default App;
