const START_DATE = new Date(2015, 0, 1);

export function tickToDate(tick: number): string {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + tick);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

