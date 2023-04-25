import { salaryOptions, annualOptions } from './model.js';

const { ref } = Vue;

const getEmployee = async () => {
  return fetch('./employee.json').then((r) => r.json());
};

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
    const tableRef = ref(null);

    const filterEmployee = (
      employeeClone,
      { company = '', salary = '', annual = '' }
    ) => {
      [companyValue.value, salaryValue.value, annualValue.value] = [
        company,
        salary,
        annual,
      ];

      let filteredEmp = employeeClone;
      if (company)
        filteredEmp = filteredEmp.filter((e) => filters.company(e, company));
      if (salary) filteredEmp = filteredEmp.filter(filters.salary[salary]);
      if (annual) filteredEmp = filteredEmp.filter(filters.annual[annual]);

      tableRef.value.setScrollTop(0);
      return filteredEmp;
    };

    const companyChange = (company) => {
      employee.value = filterEmployee(employeeClone.value, {
        company,
      });
    };

    const salaryChange = (salary) => {
      employee.value = filterEmployee(employeeClone.value, {
        salary,
      });
    };

    const annualChange = (annual) => {
      employee.value = filterEmployee(employeeClone.value, {
        annual,
      });
    };

    const init = async () => {
      try {
        let res = await getEmployee();
        companyOptions.value = [...new Set(res.map((e) => e.companyName))].map(
          (e) => {
            return {
              value: e,
              label: e,
            };
          }
        );
        employee.value = res;
        employeeClone.value = structuredClone(res);
      } finally {
        loading.value = false;
      }
    };

    init();
    return {
      employee,
      companyValue,
      companyOptions,
      companyChange,
      salaryValue,
      salaryOptions,
      salaryChange,
      annualValue,
      annualOptions,
      annualChange,
      loading,
      tableRef,
    };
  },
};

export default App;
