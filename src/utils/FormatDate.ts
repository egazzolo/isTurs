export function formatDate(dateString: any): any {
    const months: string[] = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
  
    const date: Date = new Date(dateString.replace(' ', 'T'));
    const day: number = date.getDate();
    const month: string = months[date.getMonth()];
    const year: number = date.getFullYear();
  
    return `${day} de ${month} del ${year}`;
  }
  