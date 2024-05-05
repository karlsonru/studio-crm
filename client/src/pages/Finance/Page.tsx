import { ContentTabIncome } from './ContentTabIncome';
import { ContentTabExpenses } from './ContentTabExpenses';
import { useTitle } from '../../shared/hooks/useTitle';
import { TabsWrapper } from '../../shared/components/TabsWrapper';

export function FinancePage() {
  useTitle('Финансы');

  return (
    <TabsWrapper
      defaultTab="income"
      tabsContent={[
        {
          label: 'Доходы',
          value: 'income',
          content: <ContentTabIncome />,
        },
        {
          label: 'Расходы',
          value: 'expenses',
          content: <ContentTabExpenses />,
        },
      ]}
    />
  );
}
