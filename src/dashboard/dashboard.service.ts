import { Injectable } from '@nestjs/common';
import { Game_user_records } from 'src/game-user-records/game-user-record.entity';
import { Game_Users } from 'src/game-users/games-user.entity';
import { GradesRepository } from 'src/grades/grades.repository';
import { Headquarters } from 'src/headquarters/headquarter.entity';
import { Institutions } from 'src/institutions/institution.entity';
import { Mini_games } from 'src/mini-games/mini-game.entity';
import { Subject_mini_game } from 'src/subject-mini-game/subject-mini-game.entity';
import { Subjects } from 'src/subjects/subject.entity';
import { Towns } from 'src/towns/town.entity';
import { createQueryBuilder, getConnection, getRepository } from 'typeorm';

@Injectable()
export class DashBoardService {
  async getDashboardDataByDepartment(id: string) {
    let dataToReturn = {
      departamento: '',
      municipios: [],
    };

    dataToReturn['departamento'] = 'Valle del Cauca';

    const towns = await getConnection()
      .createQueryBuilder()
      .select('TOWNS')
      .from(Towns, 'TOWNS')
      .getMany();

    const institutionsByTown = await createQueryBuilder(Towns, 'TN')
      .innerJoinAndSelect(Headquarters, 'HQ', 'HQ.town_id = TN.id')
      .innerJoinAndSelect(Institutions, 'IT', 'HQ.institution_id = IT.id')
      .getRawMany();

    for (let town of towns) {
      dataToReturn.municipios.push({ id: town.id, name: town.name });
    }

    for (let town of dataToReturn['municipios']) {
      town['sedes'] = [];
      for (let institutionByTown of institutionsByTown) {
        if (institutionByTown.TN_name == town.name) {
          town.sedes.push({
            id: institutionByTown.HQ_id,
            name: institutionByTown.HQ_name,
            institucion: institutionByTown.IT_name,
            grados: [],
          });

          // for (let sede of town.sedes) {
          //   const grades = await this.getAllGrades(sede.id);
          //   console.log(grades);
          //   for (let grade of grades) {
          //     if ((sede.id = grade['HQ_id'])) {
          //       sede['grados'].push(grade);
          //     }
          //   }
          // }
        }
      }
      // for( let sede of town['sedes'] ){
      //   const grades = await this.getAllGrades(sede.id);
      //   console.log(grades);
      //   for(let grade of grades){
      //     if(sede.id = grade['HQ_id']){
      //       // if()
      //       sede['grados'].push(grade);
      //       // town['sedes'][sedeIndex]['grados'].push(grade);
      //       // console.log(town['sedes'][sedeIndex]['grados']);
      //     }
      //   }
      // }
    }

    // for( let town of dataToReturn['municipios'] ){
    //   for( let sede of town['sedes'] ){
    //     const grades = await this.getAllGrades(sede.id);
    //     // console.log(grades);
    //     for(let grade of grades){
    //       if(sede.id = grade['HQ_id']){
    //         // if()
    //         sede['grados'].push(grade);
    //         // town['sedes'][sedeIndex]['grados'].push(grade);
    //         // console.log(town['sedes'][sedeIndex]['grados']);
    //       }
    //     }
    //   }
    // }
    return dataToReturn;
  }

  private async getAllGrades(headquarterId) {
    return (
      createQueryBuilder(Headquarters, 'HQ')
        .innerJoin(Game_Users, 'GU', 'GU.headquarter_id = HQ.id')
        .innerJoin(Game_user_records, 'GUR', 'GUR.game_user_id = GU.id')
        .innerJoin(
          Mini_games,
          'MG',
          'GUR.mini_game_id = MG.id AND GU.grade_id = MG.grade_id',
        )
        .innerJoin(Subject_mini_game, 'SMG', 'SMG.mini_game_id = MG.id')
        .leftJoin(Subjects, 'S', 'S.id = SMG.subject_id')
        .select('GU.grade_id')
        .addSelect('HQ.id')
        .where('GU.headquarter_id = :headquarterId', {
          headquarterId: headquarterId,
        })
        // .andWhere('GU.grade_id = :gradeId', { gradeId: 9 })
        .groupBy('GU.grade_id')
        .getRawMany()
    );
    // dataToReturn['municipios'].map(async (town, index) => {
    //   for (const [index, sede] of Object.entries(town.sedes)) {

    //   }
    //   console.log(dataToReturn['municipios'][0]['sedes']);
    // });
    // return dataToReturn;

    // const gradesAsignatures = await createQueryBuilder(Headquarters, 'HQ')
    //       .innerJoin(Game_Users, 'GU', 'GU.headquarter_id = HQ.id')
    //       .innerJoin(Game_user_records, 'GUR', 'GUR.game_user_id = GU.id')
    //       .innerJoin(
    //         Mini_games,
    //         'MG',
    //         'GUR.mini_game_id = MG.id AND GU.grade_id = MG.grade_id',
    //       )
    //       .innerJoin(Subject_mini_game, 'SMG', 'SMG.mini_game_id = MG.id')
    //       .leftJoin(Subjects, 'S', 'S.id = SMG.subject_id')
    //       .select('S.name')
    //       .addSelect(`ROUND(AVG(GUR.total_score), 2) as 'Average'`)
    //       .addSelect('HQ.id')
    //       .addSelect('HQ.institution_id')
    //       .addSelect('HQ.town_id')
    //       .addSelect('GU.grade_id')
    //       .where('GU.headquarter_id = :headquarterId', {
    //         headquarterId: sede['id'],
    //       })
    //       // .andWhere('GU.grade_id = :gradeId', { gradeId: 9 })
    //       .groupBy('S.name')
    //       .orderBy('GU.grade_id, S.name')
    //       .getRawMany();
    //     town.sedes[index]['grados'].push(gradesAsignatures);
  }

  async getDashboardDataByDepartmentV2(id: string) {
    let dataToReturn = {
      departamento: '',
      municipios: [],
    };

    dataToReturn['departamento'] = 'Valle del Cauca';

    const towns = await getConnection()
      .createQueryBuilder()
      .select('TOWNS')
      .from(Towns, 'TOWNS')
      .getMany();

    const institutionsByTown = await createQueryBuilder(Towns, 'TN')
      .innerJoinAndSelect(Headquarters, 'HQ', 'HQ.town_id = TN.id')
      .innerJoinAndSelect(Institutions, 'IT', 'HQ.institution_id = IT.id')
      .getRawMany();

    for (let town of towns) {
      dataToReturn.municipios.push({ id: town.id, name: town.name });
    }

    for (let town of dataToReturn['municipios']) {
      town['instituciones'] = [];
      for (let institutionByTown of institutionsByTown) {
        if (institutionByTown.TN_name == town.name) {
          // let isInstitutionAlreadyWrite;
          if (town.instituciones.length === 0) {
            console.log('prueba');
            town.instituciones.push({
              id: institutionByTown.IT_id,
              institucion: institutionByTown.IT_name,
            });
          }else{
            let isInstitutionAlreadyWrite = town.instituciones.find((institucion) => {
              console.log(institucion.id === institutionByTown.IT_id);
              return institucion.id === institutionByTown.IT_id;
            })
            console.log(isInstitutionAlreadyWrite);
          }
          // console.log(isInstitutionAlreadyWrite);
          // town.instituciones.push({
          //   id: institutionByTown.IT_id,
          //   institucion: institutionByTown.IT_name,
          // });
        }
      }
    }
    return dataToReturn;
  }
}
