import { mount } from '@vue/test-utils';
import TransactionForm from '~/components/TransactionForm.vue';

describe('TransactionForm', () => {
  it('renders correctly', () => {
    const wrapper = mount(TransactionForm);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('submits the form with valid data', async () => {
    const wrapper = mount(TransactionForm);

    // Fill in the form fields with valid data
    await fillFormFields(wrapper, {
      store: 'Test Store',
      amount: '50',
      date: '2023-01-01',
      type: 'EXPENSE',
      category: 'Groceries',
      customCategory: false,
      customCategoryName: '',
    });

    // Trigger the form submission
    await wrapper.find('form').trigger('submit.prevent');

    // Add assertions based on the expected behavior after submitting the form
    expect(wrapper.emitted().submit).toBeTruthy();
    expect(wrapper.vm.state.store).toBe('');
    expect(wrapper.vm.state.amount).toBe('');
    expect(wrapper.vm.state.date).toBe('');
    // Add more assertions as needed
  });

  it('shows an error message on form submission with invalid data', async () => {
    const wrapper = mount(TransactionForm);

    // Trigger the form submission without filling in required fields
    await wrapper.find('form').trigger('submit.prevent');

    // Add assertions based on the expected behavior after submitting the form with invalid data
    expect(wrapper.emitted().submit).toBeFalsy();
    // Add more assertions as needed
  });

  it('adds a custom category when selected', async () => {
    const wrapper = mount(TransactionForm);

    // Enable custom category
    await wrapper.setData({ state: { customCategory: true } });

    // Fill in the custom category name
    await wrapper.setData({ state: { customCategoryName: 'CustomCategory' } });

    // Trigger the form submission
    await wrapper.find('form').trigger('submit.prevent');

    // Add assertions based on the expected behavior after submitting the form with a custom category
    expect(wrapper.emitted().submit).toBeTruthy();
    // Ensure the custom category is added to the list
    expect(wrapper.vm.allCategories).toContain('CustomCategory');
  });

  // Add more test cases as needed
});

async function fillFormFields(wrapper, data) {
  await wrapper.setData({ state: data });
}
