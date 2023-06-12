import { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';
import { ContentTabIncome } from './ContentTabIncome';
import { ContentTabOutcome } from './ContentTabOutcome';
import { useTitle } from '../../shared/hooks/useTitle';

/*
Как я сам себе это представляю:
- страница с финансами и графиками

Сверху чекбоксы управления для отображения активных фильтров

На графиках показан доход / расход / кол-во абонементов по одной локации

На одном графике можно вывести 2 локации для сравнения
По умолчанию запрашивается статистика за последние 3 месяца
Можно запросить статистику за последний год

График для второй локации можно построить отдельным компонентом

График месяц / доход по педагогам (сотрудникам). Считается по абонементам у этого учителя ?
*/

export function FinancePage() {
  useTitle('Финансы');

  const [value, setValue] = useState('income');

  return (
    <>
      <header style={{
        marginBottom: '1rem',
        textAlign: 'right',
      }}>
      </header>

      <TabContext value={value}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" paddingX={3}>
          <Tabs
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            sx={{ marginBottom: '1rem' }}
          >
            <Tab label="Доходы" value="income" />
            <Tab label="Расходы" value="outcome" />
          </Tabs>
        </Stack>
        <TabPanel value="income">
          <ContentTabIncome />
        </TabPanel>
        <TabPanel value="outcome">
          <ContentTabOutcome />
        </TabPanel>
      </TabContext>

    </>
  );
}
