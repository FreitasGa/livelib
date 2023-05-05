export class CreateRentDto {
  price: number;
  clientId: string;
  booksIds: string[];
  startDate: Date;
  endDate: Date;
}
