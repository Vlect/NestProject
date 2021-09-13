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
import {
  createQueryBuilder,
  getConnection,
  getManager,
  getRepository,
} from 'typeorm';

@Injectable()
export class DashBoardService {
  private manager = getManager();

  async getDashboardDataByDepartment(id) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const departmentWithAsignatures = await this.manager.query(`
      SELECT 
        DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        S.id as 'subject_id',
        S.name as 'subject_name',
        ROUND(AVG(GUR.total_score), 2) as 'subject_average' 
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.mini_games MG 
            ON GUR.mini_game_id = MG.id 
            AND GU.grade_id = MG.grade_id 
          JOIN talentumehs_valle_magico.subject_mini_game SMG 
            ON SMG.mini_game_id = MG.id 
          RIGHT JOIN talentumehs_valle_magico.subjects S 
            ON SMG.subject_id = S.id 
      WHERE DP.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (S.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (S.name)
    `);

    const departmentWithInstelligences = await this.manager.query(`
      SELECT 
        DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        I.id as 'intelligence_id',
        I.name as 'intelligence_name',
        ROUND(AVG(GUI.percentage_value), 2) as 'intelligence_average'
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
            ON GUI.game_user_record_id = GUR.id
          RIGHT JOIN talentumehs_valle_magico.intelligence_indicators II
            ON GUI.intelligence_indicator_id = II.id
          RIGHT JOIN talentumehs_valle_magico.intelligences I
            ON II.intelligence_id = I.id
      WHERE DP.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (I.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (I.name)
    `);

    const departmentWithStyles = await this.manager.query(`
      SELECT 
        TSBUS.town_id,
        TSBUS.town_name,
        TSBUS.institutions_id,
        TSBUS.institutions_name,
        TSBUS.headquarter_id,
        TSBUS.headquarter_name,
        TSBUS.grade_id,
        S.name as 'style_name',
        ROUND(AVG(TSBUS.total_by_area/TSBU.total_by_user), 2) * 100 as 'style_average'
        FROM (
          SELECT
            TW.id as 'town_id',
            TW.name as 'town_name',
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            HQ.id as 'headquarter_id',
            HQ.name as 'headquarter_name',
            GU.id as 'game_user_id',
            GU.grade_id,
            DS.style_id as 'style',
            COUNT(GUI.id) as 'total_by_area'
            FROM talentumehs_valle_open_location.departments DP
            JOIN talentumehs_valle_open_location.towns TW
              ON DP.id = TW.department_id
            JOIN talentumehs_valle_open_location.headquarters HQ
              ON TW.id = HQ.town_id
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE DP.id = ${id}
            GROUP BY (DS.style_id), (GU.id) 
        ) AS TSBUS
        JOIN (
          SELECT
            TW.id as 'town_id',
            TW.name as 'town_name',
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            GU.id,
            GU.grade_id,
            COUNT(GUI.id) as 'total_by_user'
            FROM talentumehs_valle_open_location.departments DP
            JOIN talentumehs_valle_open_location.towns TW
              ON DP.id = TW.department_id
            JOIN talentumehs_valle_open_location.headquarters HQ
              ON TW.id = HQ.town_id
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE DP.id = ${id}
            GROUP BY (GU.id)
        ) AS TSBU 
          ON TSBUS.game_user_id = TSBU.id
        JOIN talentumehs_valle_magico.styles S
          ON TSBUS.style = S.id
        GROUP BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style), (TSBUS.grade_id)
        ORDER BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style)
    `);

    for (const key in departmentWithAsignatures) {
      if (dataToReturn.municipios.length === 0) {
        dataToReturn.municipios.push({
          id: departmentWithAsignatures[key].town_name,
          sedes: [
            {
              id: departmentWithAsignatures[key].headquarter_name,
              institutcion: departmentWithAsignatures[key].institution_name,
              grados: [
                {
                  id: this.gradesFromNumberToString(
                    departmentWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: departmentWithAsignatures[key].subject_name,
                      promedio: departmentWithAsignatures[key].subject_average,
                    },
                  ],
                  inteligencias: [],
                  estilos: [],
                  vocaciones: [],
                },
              ],
            },
          ],
        });
      } else {
        const municipioIndex = dataToReturn.municipios
          .map((municipio) => municipio.id)
          .indexOf(departmentWithAsignatures[key].town_name);

        if (municipioIndex != -1) {
          const sedeIndex = dataToReturn.municipios[municipioIndex].sedes
            .map((sede) => sede.id)
            .indexOf(departmentWithAsignatures[key].headquarter_name);

          if (sedeIndex != -1) {
            const gradeIndex = dataToReturn.municipios[municipioIndex].sedes[
              sedeIndex
            ].grados
              .map((grade) => grade.id)
              .indexOf(
                this.gradesFromNumberToString(
                  departmentWithAsignatures[key].grade_id,
                ),
              );

            if (gradeIndex != -1) {
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].asignatura.push({
                id: departmentWithAsignatures[key].subject_name,
                promedio: departmentWithAsignatures[key].subject_average,
              });
            } else {
              dataToReturn.municipios[municipioIndex].sedes[
                sedeIndex
              ].grados.push({
                id: this.gradesFromNumberToString(
                  departmentWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: departmentWithAsignatures[key].subject_name,
                    promedio: departmentWithAsignatures[key].subject_average,
                  },
                ],
                inteligencias: [],
                estilos: [],
                vocaciones: [],
              });
            }
          } else {
            dataToReturn.municipios[municipioIndex].sedes.push({
              id: departmentWithAsignatures[key].headquarter_name,
              institutcion: departmentWithAsignatures[key].institution_name,
              grados: [
                {
                  id: this.gradesFromNumberToString(
                    departmentWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: departmentWithAsignatures[key].subject_name,
                      promedio: departmentWithAsignatures[key].subject_average,
                    },
                  ],
                  inteligencias: [],
                  estilos: [],
                  vocaciones: [],
                },
              ],
            });
          }
        } else {
          dataToReturn.municipios.push({
            id: departmentWithAsignatures[key].town_name,
            sedes: [
              {
                id: departmentWithAsignatures[key].headquarter_name,
                institutcion: departmentWithAsignatures[key].institution_name,
                grados: [
                  {
                    id: this.gradesFromNumberToString(
                      departmentWithAsignatures[key].grade_id,
                    ),
                    asignatura: [
                      {
                        id: departmentWithAsignatures[key].subject_name,
                        promedio:
                          departmentWithAsignatures[key].subject_average,
                      },
                    ],
                    inteligencias: [],
                    estilos: [],
                    vocaciones: [],
                  },
                ],
              },
            ],
          });
        }
      }
    }

    for (const key in departmentWithInstelligences) {
      const municipioIndex = dataToReturn.municipios
        .map((municipio) => municipio.id)
        .indexOf(departmentWithInstelligences[key].town_name);
      if (municipioIndex != -1) {
        const sedeIndex = dataToReturn.municipios[municipioIndex].sedes
          .map((sede) => sede.id)
          .indexOf(departmentWithInstelligences[key].headquarter_name);
        if (sedeIndex != -1) {
          const gradeIndex = dataToReturn.municipios[municipioIndex].sedes[
            sedeIndex
          ].grados
            .map((grade) => grade.id)
            .indexOf(
              this.gradesFromNumberToString(
                departmentWithInstelligences[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            const notIntelligenceFound =
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].inteligencias
                .map((inteligencia) => inteligencia.id)
                .indexOf(departmentWithInstelligences[key].intelligence_name) ==
              -1;
            if (notIntelligenceFound) {
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].inteligencias.push({
                id: departmentWithInstelligences[key].intelligence_name,
                promedio:
                  departmentWithInstelligences[key].intelligence_average,
              });
            }
          } else {
            dataToReturn.municipios[municipioIndex].sedes[
              sedeIndex
            ].grados.push({
              id: this.gradesFromNumberToString(
                departmentWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: departmentWithInstelligences[key].intelligence_name,
                  promedio:
                    departmentWithInstelligences[key].intelligence_average,
                },
              ],
              estilos: [],
              vocaciones: [],
            });
          }
        } else {
          dataToReturn.municipios[municipioIndex].sedes.push({
            id: departmentWithInstelligences[key].headquarter_name,
            institutcion: departmentWithInstelligences[key].institution_name,
            grados: [
              {
                id: this.gradesFromNumberToString(
                  departmentWithInstelligences[key].grade_id,
                ),
                asignatura: [],
                inteligencias: [
                  {
                    id: departmentWithInstelligences[key].intelligence_name,
                    promedio:
                      departmentWithInstelligences[key].intelligence_average,
                  },
                ],
                estilos: [],
                vocaciones: [],
              },
            ],
          });
        }
      }
    }

    for (const key in departmentWithStyles) {
      const municipioIndex = dataToReturn.municipios
        .map((municipio) => municipio.id)
        .indexOf(departmentWithStyles[key].town_name);
      if (municipioIndex != -1) {
        const sedeIndex = dataToReturn.municipios[municipioIndex].sedes
          .map((sede) => sede.id)
          .indexOf(departmentWithStyles[key].headquarter_name);
        if (sedeIndex != -1) {
          const gradeIndex = dataToReturn.municipios[municipioIndex].sedes[
            sedeIndex
          ].grados
            .map((grade) => grade.id)
            .indexOf(
              this.gradesFromNumberToString(departmentWithStyles[key].grade_id),
            );

          if (gradeIndex != -1) {
            const notStyleFound =
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].estilos
                .map((inteligencia) => inteligencia.id)
                .indexOf(departmentWithStyles[key].style_name) == -1;
            if (notStyleFound) {
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].estilos.push({
                id: departmentWithStyles[key].style_name,
                promedio: departmentWithStyles[key].style_average,
              });
            }
          } else {
            dataToReturn.municipios[municipioIndex].sedes[
              sedeIndex
            ].grados.push({
              id: this.gradesFromNumberToString(
                departmentWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: departmentWithStyles[key].style_name,
                  promedio: departmentWithStyles[key].style_average,
                },
              ],
              vocaciones: [],
            });
          }
        } else {
          dataToReturn.municipios[municipioIndex].sedes.push({
            id: departmentWithStyles[key].headquarter_name,
            institutcion: departmentWithStyles[key].institution_name,
            grados: [
              {
                id: this.gradesFromNumberToString(
                  departmentWithStyles[key].grade_id,
                ),
                asignatura: [],
                inteligencias: [],
                estilos: [
                  {
                    id: departmentWithStyles[key].style_name,
                    promedio: departmentWithStyles[key].style_average,
                  },
                ],
                vocaciones: [],
              },
            ],
          });
        }
      }
    }

    return dataToReturn;
  }

  async getDashboardDataByInstitution(id) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const institutionWithAsignatures = await this.manager.query(`
      SELECT 
      DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        S.id as 'subject_id',
        S.name as 'subject_name',
        ROUND(AVG(GUR.total_score), 2) as 'subject_average' 
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.mini_games MG 
            ON GUR.mini_game_id = MG.id 
            AND GU.grade_id = MG.grade_id 
          JOIN talentumehs_valle_magico.subject_mini_game SMG 
            ON SMG.mini_game_id = MG.id 
          RIGHT JOIN talentumehs_valle_magico.subjects S 
            ON SMG.subject_id = S.id 
      WHERE IT.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (S.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (S.name)
    `);

    const institutionWithInstelligences = await this.manager.query(`
      SELECT 
      DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        I.id as 'intelligence_id',
        I.name as 'intelligence_name',
        ROUND(AVG(GUI.percentage_value), 2) as 'intelligence_average'
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
            ON GUI.game_user_record_id = GUR.id
          RIGHT JOIN talentumehs_valle_magico.intelligence_indicators II
            ON GUI.intelligence_indicator_id = II.id
          RIGHT JOIN talentumehs_valle_magico.intelligences I
            ON II.intelligence_id = I.id
      WHERE IT.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (I.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (I.name)
    `);

    const institutionWithStyles = await this.manager.query(`
      SELECT 
        TSBUS.institutions_id,
        TSBUS.institutions_name,
        TSBUS.headquarter_id,
        TSBUS.headquarter_name,
        TSBUS.grade_id,
        S.name as 'style_name',
        ROUND(AVG(TSBUS.total_by_area/TSBU.total_by_user), 2) * 100 as 'style_average'
        FROM (
          SELECT
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            HQ.id as 'headquarter_id',
            HQ.name as 'headquarter_name',
            GU.id as 'game_user_id',
            GU.grade_id,
            DS.style_id as 'style',
            COUNT(GUI.id) as 'total_by_area'
            FROM talentumehs_valle_open_location.headquarters HQ
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE IT.id = ${id}
            GROUP BY (DS.style_id), (GU.id) 
        ) AS TSBUS
        JOIN (
          SELECT
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            GU.id,
            GU.grade_id,
            COUNT(GUI.id) as 'total_by_user'
            FROM talentumehs_valle_open_location.headquarters HQ
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE IT.id = ${id}
            GROUP BY (GU.id)
        ) AS TSBU 
          ON TSBUS.game_user_id = TSBU.id
        JOIN talentumehs_valle_magico.styles S
          ON TSBUS.style = S.id
        GROUP BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style), (TSBUS.grade_id)
        ORDER BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style)
    `);

    for (const key in institutionWithAsignatures) {
      if (dataToReturn.municipios.length === 0) {
        dataToReturn.municipios.push({
          id: institutionWithAsignatures[key].town_name,
          sedes: [
            {
              id: institutionWithAsignatures[key].headquarter_name,
              institutcion: institutionWithAsignatures[key].institution_name,
              grados: [
                {
                  id: this.gradesFromNumberToString(
                    institutionWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: institutionWithAsignatures[key].subject_name,
                      promedio: institutionWithAsignatures[key].subject_average,
                    },
                  ],
                  inteligencias: [],
                  estilos: [],
                  vocaciones: [],
                },
              ],
            },
          ],
        });
      } else {
        const sedeIndex = dataToReturn.municipios[0].sedes
          .map((sede) => sede.id)
          .indexOf(institutionWithAsignatures[key].headquarter_name);

        if (sedeIndex != -1) {
          const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
            .map((grade) => grade.id)
            .indexOf(
              this.gradesFromNumberToString(
                institutionWithAsignatures[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].asignatura.push({
              id: institutionWithAsignatures[key].subject_name,
              promedio: institutionWithAsignatures[key].subject_average,
            });
          } else {
            dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
              id: this.gradesFromNumberToString(
                institutionWithAsignatures[key].grade_id,
              ),
              asignatura: [
                {
                  id: institutionWithAsignatures[key].subject_name,
                  promedio: institutionWithAsignatures[key].subject_average,
                },
              ],
              inteligencias: [],
              estilos: [],
              vocaciones: [],
            });
          }
        } else {
          dataToReturn.municipios[0].sedes.push({
            id: institutionWithAsignatures[key].headquarter_name,
            institutcion: institutionWithAsignatures[key].institution_name,
            grados: [
              {
                id: this.gradesFromNumberToString(
                  institutionWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: institutionWithAsignatures[key].subject_name,
                    promedio: institutionWithAsignatures[key].subject_average,
                  },
                ],
                inteligencias: [],
                estilos: [],
                vocaciones: [],
              },
            ],
          });
        }
      }
    }

    for (const key in institutionWithInstelligences) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(institutionWithInstelligences[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.gradesFromNumberToString(
              institutionWithInstelligences[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notIntelligenceFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias
              .map((inteligencia) => inteligencia.id)
              .indexOf(institutionWithInstelligences[key].intelligence_name) ==
            -1;
          if (notIntelligenceFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias.push({
              id: institutionWithInstelligences[key].intelligence_name,
              promedio: institutionWithInstelligences[key].intelligence_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.gradesFromNumberToString(
              institutionWithInstelligences[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [
              {
                id: institutionWithInstelligences[key].intelligence_name,
                promedio:
                  institutionWithInstelligences[key].intelligence_average,
              },
            ],
            estilos: [],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: institutionWithInstelligences[key].headquarter_name,
          institutcion: institutionWithInstelligences[key].institution_name,
          grados: [
            {
              id: this.gradesFromNumberToString(
                institutionWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: institutionWithInstelligences[key].intelligence_name,
                  promedio:
                    institutionWithInstelligences[key].intelligence_average,
                },
              ],
              estilos: [],
              vocaciones: [],
            },
          ],
        });
      }
    }

    for (const key in institutionWithStyles) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(institutionWithStyles[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.gradesFromNumberToString(institutionWithStyles[key].grade_id),
          );

        if (gradeIndex != -1) {
          const notStyleFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos
              .map((inteligencia) => inteligencia.id)
              .indexOf(institutionWithStyles[key].style_name) == -1;
          if (notStyleFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos.push({
              id: institutionWithStyles[key].style_name,
              promedio: institutionWithStyles[key].style_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.gradesFromNumberToString(
              institutionWithStyles[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [
              {
                id: institutionWithStyles[key].style_name,
                promedio: institutionWithStyles[key].style_average,
              },
            ],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: institutionWithStyles[key].headquarter_name,
          institutcion: institutionWithStyles[key].institution_name,
          grados: [
            {
              id: this.gradesFromNumberToString(
                institutionWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: institutionWithStyles[key].style_name,
                  promedio: institutionWithStyles[key].style_average,
                },
              ],
              vocaciones: [],
            },
          ],
        });
      }
    }

    return dataToReturn;
  }

  async getDashboardDataByHeadquarter(id) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const headquarterWithAsignatures = await this.manager.query(`
      SELECT 
      DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        S.id as 'subject_id',
        S.name as 'subject_name',
        ROUND(AVG(GUR.total_score), 2) as 'subject_average' 
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.mini_games MG 
            ON GUR.mini_game_id = MG.id 
            AND GU.grade_id = MG.grade_id 
          JOIN talentumehs_valle_magico.subject_mini_game SMG 
            ON SMG.mini_game_id = MG.id 
          RIGHT JOIN talentumehs_valle_magico.subjects S 
            ON SMG.subject_id = S.id 
      WHERE HQ.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (S.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (S.name)
    `);

    const headquarterWithInstelligences = await this.manager.query(`
      SELECT 
      DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        I.id as 'intelligence_id',
        I.name as 'intelligence_name',
        ROUND(AVG(GUI.percentage_value), 2) as 'intelligence_average'
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
            ON GUI.game_user_record_id = GUR.id
          RIGHT JOIN talentumehs_valle_magico.intelligence_indicators II
            ON GUI.intelligence_indicator_id = II.id
          RIGHT JOIN talentumehs_valle_magico.intelligences I
            ON II.intelligence_id = I.id
      WHERE HQ.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (I.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (I.name)
    `);

    const headquarterWithStyles = await this.manager.query(`
      SELECT 
        TSBUS.institutions_id,
        TSBUS.institutions_name,
        TSBUS.headquarter_id,
        TSBUS.headquarter_name,
        TSBUS.grade_id,
        S.name as 'style_name',
        ROUND(AVG(TSBUS.total_by_area/TSBU.total_by_user), 2) * 100 as 'style_average'
        FROM (
          SELECT
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            HQ.id as 'headquarter_id',
            HQ.name as 'headquarter_name',
            GU.id as 'game_user_id',
            GU.grade_id,
            DS.style_id as 'style',
            COUNT(GUI.id) as 'total_by_area'
            FROM talentumehs_valle_open_location.headquarters HQ
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE HQ.id = ${id}
            GROUP BY (DS.style_id), (GU.id) 
        ) AS TSBUS
        JOIN (
          SELECT
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            GU.id,
            GU.grade_id,
            COUNT(GUI.id) as 'total_by_user'
            FROM talentumehs_valle_open_location.headquarters HQ
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE HQ.id = ${id}
            GROUP BY (GU.id)
        ) AS TSBU 
          ON TSBUS.game_user_id = TSBU.id
        JOIN talentumehs_valle_magico.styles S
          ON TSBUS.style = S.id
        GROUP BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style), (TSBUS.grade_id)
        ORDER BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style)
    `);

    for (const key in headquarterWithAsignatures) {
      if (dataToReturn.municipios.length === 0) {
        dataToReturn.municipios.push({
          id: headquarterWithAsignatures[key].town_name,
          sedes: [
            {
              id: headquarterWithAsignatures[key].headquarter_name,
              institutcion: headquarterWithAsignatures[key].institution_name,
              grados: [
                {
                  id: this.gradesFromNumberToString(
                    headquarterWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: headquarterWithAsignatures[key].subject_name,
                      promedio: headquarterWithAsignatures[key].subject_average,
                    },
                  ],
                  inteligencias: [],
                  estilos: [],
                  vocaciones: [],
                },
              ],
            },
          ],
        });
      } else {
        const sedeIndex = dataToReturn.municipios[0].sedes
          .map((sede) => sede.id)
          .indexOf(headquarterWithAsignatures[key].headquarter_name);

        if (sedeIndex != -1) {
          const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
            .map((grade) => grade.id)
            .indexOf(
              this.gradesFromNumberToString(
                headquarterWithAsignatures[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].asignatura.push({
              id: headquarterWithAsignatures[key].subject_name,
              promedio: headquarterWithAsignatures[key].subject_average,
            });
          } else {
            dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
              id: this.gradesFromNumberToString(
                headquarterWithAsignatures[key].grade_id,
              ),
              asignatura: [
                {
                  id: headquarterWithAsignatures[key].subject_name,
                  promedio: headquarterWithAsignatures[key].subject_average,
                },
              ],
              inteligencias: [],
              estilos: [],
              vocaciones: [],
            });
          }
        } else {
          dataToReturn.municipios[0].sedes.push({
            id: headquarterWithAsignatures[key].headquarter_name,
            institutcion: headquarterWithAsignatures[key].institution_name,
            grados: [
              {
                id: this.gradesFromNumberToString(
                  headquarterWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: headquarterWithAsignatures[key].subject_name,
                    promedio: headquarterWithAsignatures[key].subject_average,
                  },
                ],
                inteligencias: [],
                estilos: [],
                vocaciones: [],
              },
            ],
          });
        }
      }
    }

    for (const key in headquarterWithInstelligences) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(headquarterWithInstelligences[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.gradesFromNumberToString(
              headquarterWithInstelligences[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notIntelligenceFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias
              .map((inteligencia) => inteligencia.id)
              .indexOf(headquarterWithInstelligences[key].intelligence_name) ==
            -1;
          if (notIntelligenceFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias.push({
              id: headquarterWithInstelligences[key].intelligence_name,
              promedio: headquarterWithInstelligences[key].intelligence_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.gradesFromNumberToString(
              headquarterWithInstelligences[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [
              {
                id: headquarterWithInstelligences[key].intelligence_name,
                promedio:
                  headquarterWithInstelligences[key].intelligence_average,
              },
            ],
            estilos: [],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: headquarterWithInstelligences[key].headquarter_name,
          institutcion: headquarterWithInstelligences[key].institution_name,
          grados: [
            {
              id: this.gradesFromNumberToString(
                headquarterWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: headquarterWithInstelligences[key].intelligence_name,
                  promedio:
                    headquarterWithInstelligences[key].intelligence_average,
                },
              ],
              estilos: [],
              vocaciones: [],
            },
          ],
        });
      }
    }

    for (const key in headquarterWithStyles) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(headquarterWithStyles[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.gradesFromNumberToString(headquarterWithStyles[key].grade_id),
          );

        if (gradeIndex != -1) {
          const notStyleFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos
              .map((inteligencia) => inteligencia.id)
              .indexOf(headquarterWithStyles[key].style_name) == -1;
          if (notStyleFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos.push({
              id: headquarterWithStyles[key].style_name,
              promedio: headquarterWithStyles[key].style_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.gradesFromNumberToString(
              headquarterWithStyles[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [
              {
                id: headquarterWithStyles[key].style_name,
                promedio: headquarterWithStyles[key].style_average,
              },
            ],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: headquarterWithStyles[key].headquarter_name,
          institutcion: headquarterWithStyles[key].institution_name,
          grados: [
            {
              id: this.gradesFromNumberToString(
                headquarterWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: headquarterWithStyles[key].style_name,
                  promedio: headquarterWithStyles[key].style_average,
                },
              ],
              vocaciones: [],
            },
          ],
        });
      }
    }

    return dataToReturn;
  }

  async getDashboardDataByTown(id) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const headquarterWithAsignatures = await this.manager.query(`
      SELECT 
      DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        S.id as 'subject_id',
        S.name as 'subject_name',
        ROUND(AVG(GUR.total_score), 2) as 'subject_average' 
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.mini_games MG 
            ON GUR.mini_game_id = MG.id 
            AND GU.grade_id = MG.grade_id 
          JOIN talentumehs_valle_magico.subject_mini_game SMG 
            ON SMG.mini_game_id = MG.id 
          RIGHT JOIN talentumehs_valle_magico.subjects S 
            ON SMG.subject_id = S.id 
      WHERE TW.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (S.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (S.name)
    `);

    const headquarterWithInstelligences = await this.manager.query(`
      SELECT 
      DP.id as 'department_id',
        DP.name as 'department_name',
        TW.id as 'town_id',
        TW.name as 'town_name',
        IT.id as 'institution_id',
        IT.name as 'institution_name',
        HQ.id as 'headquarter_id',
        HQ.name as 'headquarter_name',
        GU.grade_id as 'grade_id',
        I.id as 'intelligence_id',
        I.name as 'intelligence_name',
        ROUND(AVG(GUI.percentage_value), 2) as 'intelligence_average'
      FROM talentumehs_valle_open_location.departments DP 
          JOIN talentumehs_valle_open_location.towns TW 
            ON TW.department_id = DP.id 
          JOIN talentumehs_valle_open_location.headquarters HQ 
            ON HQ.town_id = TW.id 
          JOIN talentumehs_valle_open_location.institutions IT
            ON HQ.institution_id = IT.id
          JOIN talentumehs_valle_magico.game_users GU 
            ON GU.headquarter_id = HQ.id 
          JOIN talentumehs_valle_magico.game_user_records GUR 
            ON GUR.game_user_id = GU.id 
          JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
            ON GUI.game_user_record_id = GUR.id
          RIGHT JOIN talentumehs_valle_magico.intelligence_indicators II
            ON GUI.intelligence_indicator_id = II.id
          RIGHT JOIN talentumehs_valle_magico.intelligences I
            ON II.intelligence_id = I.id
      WHERE TW.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (I.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (I.name)
    `);

    const headquarterWithStyles = await this.manager.query(`
      SELECT 
        TSBUS.institutions_id,
        TSBUS.institutions_name,
        TSBUS.headquarter_id,
        TSBUS.headquarter_name,
        TSBUS.grade_id,
        S.name as 'style_name',
        ROUND(AVG(TSBUS.total_by_area/TSBU.total_by_user), 2) * 100 as 'style_average'
        FROM (
          SELECT
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            HQ.id as 'headquarter_id',
            HQ.name as 'headquarter_name',
            GU.id as 'game_user_id',
            GU.grade_id,
            DS.style_id as 'style',
            COUNT(GUI.id) as 'total_by_area'
            FROM talentumehs_valle_open_location.towns TW
            JOIN talentumehs_valle_open_location.headquarters HQ
              ON TW.id = HQ.town_id
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE TW.id = ${id}
            GROUP BY (DS.style_id), (GU.id) 
        ) AS TSBUS
        JOIN (
          SELECT
            IT.id as 'institutions_id',
            IT.name as 'institutions_name',
            GU.id,
            GU.grade_id,
            COUNT(GUI.id) as 'total_by_user'
            FROM talentumehs_valle_open_location.towns TW
            JOIN talentumehs_valle_open_location.headquarters HQ
              ON TW.id = HQ.town_id
            JOIN talentumehs_valle_open_location.institutions IT
              ON HQ.institution_id = IT.id
            JOIN talentumehs_valle_magico.game_users GU
              ON GU.headquarter_id = HQ.id
            JOIN talentumehs_valle_magico.game_user_records GUR
              ON GUR.game_user_id = GU.id
            JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUI
              ON GUI.game_user_record_id = GUR.id
            JOIN talentumehs_valle_magico.description_styles DS
              ON GUI.description_style_id = DS.id
            WHERE TW.id = ${id}
            GROUP BY (GU.id)
        ) AS TSBU 
          ON TSBUS.game_user_id = TSBU.id
        JOIN talentumehs_valle_magico.styles S
          ON TSBUS.style = S.id
        GROUP BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style), (TSBUS.grade_id)
        ORDER BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style)
    `);

    for (const key in headquarterWithAsignatures) {
      if (dataToReturn.municipios.length === 0) {
        dataToReturn.municipios.push({
          id: headquarterWithAsignatures[key].town_name,
          sedes: [
            {
              id: headquarterWithAsignatures[key].headquarter_name,
              institutcion: headquarterWithAsignatures[key].institution_name,
              grados: [
                {
                  id: this.gradesFromNumberToString(
                    headquarterWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: headquarterWithAsignatures[key].subject_name,
                      promedio: headquarterWithAsignatures[key].subject_average,
                    },
                  ],
                  inteligencias: [],
                  estilos: [],
                  vocaciones: [],
                },
              ],
            },
          ],
        });
      } else {
        const sedeIndex = dataToReturn.municipios[0].sedes
          .map((sede) => sede.id)
          .indexOf(headquarterWithAsignatures[key].headquarter_name);

        if (sedeIndex != -1) {
          const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
            .map((grade) => grade.id)
            .indexOf(
              this.gradesFromNumberToString(
                headquarterWithAsignatures[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].asignatura.push({
              id: headquarterWithAsignatures[key].subject_name,
              promedio: headquarterWithAsignatures[key].subject_average,
            });
          } else {
            dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
              id: this.gradesFromNumberToString(
                headquarterWithAsignatures[key].grade_id,
              ),
              asignatura: [
                {
                  id: headquarterWithAsignatures[key].subject_name,
                  promedio: headquarterWithAsignatures[key].subject_average,
                },
              ],
              inteligencias: [],
              estilos: [],
              vocaciones: [],
            });
          }
        } else {
          dataToReturn.municipios[0].sedes.push({
            id: headquarterWithAsignatures[key].headquarter_name,
            institutcion: headquarterWithAsignatures[key].institution_name,
            grados: [
              {
                id: this.gradesFromNumberToString(
                  headquarterWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: headquarterWithAsignatures[key].subject_name,
                    promedio: headquarterWithAsignatures[key].subject_average,
                  },
                ],
                inteligencias: [],
                estilos: [],
                vocaciones: [],
              },
            ],
          });
        }
      }
    }

    for (const key in headquarterWithInstelligences) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(headquarterWithInstelligences[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.gradesFromNumberToString(
              headquarterWithInstelligences[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notIntelligenceFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias
              .map((inteligencia) => inteligencia.id)
              .indexOf(headquarterWithInstelligences[key].intelligence_name) ==
            -1;
          if (notIntelligenceFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias.push({
              id: headquarterWithInstelligences[key].intelligence_name,
              promedio: headquarterWithInstelligences[key].intelligence_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.gradesFromNumberToString(
              headquarterWithInstelligences[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [
              {
                id: headquarterWithInstelligences[key].intelligence_name,
                promedio:
                  headquarterWithInstelligences[key].intelligence_average,
              },
            ],
            estilos: [],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: headquarterWithInstelligences[key].headquarter_name,
          institutcion: headquarterWithInstelligences[key].institution_name,
          grados: [
            {
              id: this.gradesFromNumberToString(
                headquarterWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: headquarterWithInstelligences[key].intelligence_name,
                  promedio:
                    headquarterWithInstelligences[key].intelligence_average,
                },
              ],
              estilos: [],
              vocaciones: [],
            },
          ],
        });
      }
    }

    for (const key in headquarterWithStyles) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(headquarterWithStyles[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.gradesFromNumberToString(headquarterWithStyles[key].grade_id),
          );

        if (gradeIndex != -1) {
          const notStyleFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos
              .map((inteligencia) => inteligencia.id)
              .indexOf(headquarterWithStyles[key].style_name) == -1;
          if (notStyleFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos.push({
              id: headquarterWithStyles[key].style_name,
              promedio: headquarterWithStyles[key].style_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.gradesFromNumberToString(
              headquarterWithStyles[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [
              {
                id: headquarterWithStyles[key].style_name,
                promedio: headquarterWithStyles[key].style_average,
              },
            ],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: headquarterWithStyles[key].headquarter_name,
          institutcion: headquarterWithStyles[key].institution_name,
          grados: [
            {
              id: this.gradesFromNumberToString(
                headquarterWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: headquarterWithStyles[key].style_name,
                  promedio: headquarterWithStyles[key].style_average,
                },
              ],
              vocaciones: [],
            },
          ],
        });
      }
    }

    return dataToReturn;
  }

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
