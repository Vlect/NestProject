import { Injectable } from '@nestjs/common';

@Injectable()
export class ParserService {
  gradesFromNumberToString(grade) {
    switch (grade) {
      case 0:
        return 'Trancisión';
      case 1:
        return 'Primero';
      case 2:
        return 'Segundo';
      case 3:
        return 'Tercero';
      case 4:
        return 'Cuarto';
      case 5:
        return 'Quinto';
      case 6:
        return 'Sexto';
      case 7:
        return 'Septimo';
      case 8:
        return 'Octavo';
      case 9:
        return 'Noveno';
      case 10:
        return 'Decimo';
      case 11:
        return 'Once';
      case 12:
        return 'Trancisión primero';
      case 13:
        return 'Segundo tercero';
      case 14:
        return 'Cuarto quinto';
      case 15:
        return 'Sexto septimo';
      case 16:
        return 'Octavo noveno';
      case 17:
        return 'Decimo once';
    }
  }
}
