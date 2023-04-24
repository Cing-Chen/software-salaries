const { ref } = Vue;

const getEmployee = () => {
  return fetch('./employee.json').then((r) => r.json());
};

const salaryOptions = [
  {
    value: 1,
    label: '0 ~ 49999',
  },
  {
    value: 2,
    label: '50000 ~ 99999',
  },
  {
    value: 3,
    label: '100000 up',
  },
];

const annualOptions = [
  {
    value: 1,
    label: '0 ~ 500000',
  },
  {
    value: 2,
    label: '500000 ~ 1000000',
  },
  {
    value: 3,
    label: '1000000 ~ 1500000',
  },
  {
    value: 4,
    label: '1500000 ~ 2000000',
  },
  {
    value: 5,
    label: '2000000 up',
  },
];

const App = {
  setup() {
    const loading = ref(true);
    const employee = ref([]);
    const employeeClone = ref([]);
    const companyValue = ref('');
    const companyOptions = ref([]);
    const salaryValue = ref('');
    const annualValue = ref('');

    const filterEmployee = (
      employeeClone,
      { company = null, salary = null, annual = null }
    ) => {
      const filters = {
        company: (e) => e.companyName === company,
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

      let filteredEmp = employeeClone;

      if (company) filteredEmp = filteredEmp.filter(filters.company);
      if (salary) filteredEmp = filteredEmp.filter(filters.salary[salary]);
      if (annual) filteredEmp = filteredEmp.filter(filters.annual[annual]);

      return filteredEmp;
    };

    const companyChange = (company) => {
      salaryValue.value = '';
      annualValue.value = '';
      employee.value = filterEmployee(employeeClone.value, {
        company,
      });
    };

    const salaryChange = (salary) => {
      companyValue.value = '';
      annualValue.value = '';
      employee.value = filterEmployee(employeeClone.value, {
        salary,
      });
    };

    const annualChange = (annual) => {
      companyValue.value = '';
      salaryValue.value = '';
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
    };
  },
};

const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount('#app');
