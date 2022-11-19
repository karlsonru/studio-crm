import { Card, CardContent, CardHeader } from '@mui/material';

interface ILessonCardDetails {
  [index: string]: string | number;
}

interface ILessonCard {
  cardDetails: ILessonCardDetails;
}

export function LessonCard({ cardDetails }: ILessonCard) {
  const {
    title, teacher, timeStart, timeEnd,
  } = cardDetails;

  return (
    <Card variant='outlined' sx={{
      height: '100px',
    }}>
      <CardHeader
        title={title}
        titleTypographyProps={{
          fontSize: '1rem',
          textAlign: 'center',
          backgroundColor: '#fff000',
        }}
        sx={{
          padding: '0px',
          maring: '0 8 0 0',
        }}
      >
      </CardHeader>
      <CardContent>
        <p>{teacher}</p>
        <p>
          <span>{timeStart}</span>
          <span> - </span>
          <span>{timeEnd}</span>
        </p>
      </CardContent>
    </Card>
  );
}
