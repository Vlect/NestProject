import { Injectable } from '@nestjs/common';
import { ParserService } from 'src/utils/parser/parser.service';
import { QueriesService } from 'src/utils/queries/queries.service';
import { getManager } from 'typeorm';
import { FilterType } from './dashboard-filter-type.enum';

@Injectable()
export class DashBoardService {
  private manager = getManager();

  constructor(
    private parserService: ParserService,
    private queriesService: QueriesService,
  ) {}

  async getDashboardDataByDepartment(departmentId) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const departmentWithAsignatures =
      await this.queriesService.getDataWithAsignatures(
        departmentId,
        FilterType.DEPARTMENT,
      );

    const departmentWithInstelligences =
      await this.queriesService.getDataWithInstelligences(
        departmentId,
        FilterType.DEPARTMENT,
      );

    const departmentWithStyles =
      await this.queriesService.getDepartmentWithStyles(departmentId);

    const departmentWithVocations =
      await this.queriesService.getDataWithVocations(
        departmentId,
        FilterType.DEPARTMENT,
      );

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
                  id: this.parserService.gradesFromNumberToString(
                    departmentWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: departmentWithAsignatures[key].subject_name,
                      cantidadDeEstudiantes:
                        departmentWithAsignatures[key].total_students,
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
                this.parserService.gradesFromNumberToString(
                  departmentWithAsignatures[key].grade_id,
                ),
              );

            if (gradeIndex != -1) {
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].asignatura.push({
                id: departmentWithAsignatures[key].subject_name,
                cantidadDeEstudiantes:
                  departmentWithAsignatures[key].total_students,
                promedio: departmentWithAsignatures[key].subject_average,
              });
            } else {
              dataToReturn.municipios[municipioIndex].sedes[
                sedeIndex
              ].grados.push({
                id: this.parserService.gradesFromNumberToString(
                  departmentWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: departmentWithAsignatures[key].subject_name,
                    cantidadDeEstudiantes:
                      departmentWithAsignatures[key].total_students,
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
                  id: this.parserService.gradesFromNumberToString(
                    departmentWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: departmentWithAsignatures[key].subject_name,
                      cantidadDeEstudiantes:
                        departmentWithAsignatures[key].total_students,
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
                    id: this.parserService.gradesFromNumberToString(
                      departmentWithAsignatures[key].grade_id,
                    ),
                    asignatura: [
                      {
                        id: departmentWithAsignatures[key].subject_name,
                        cantidadDeEstudiantes:
                          departmentWithAsignatures[key].total_students,
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
              this.parserService.gradesFromNumberToString(
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
                cantidadDeEstudiantes:
                  departmentWithInstelligences[key].total_students,
                indicador:
                  departmentWithInstelligences[key].intelligence_average,
              });
            }
          } else {
            dataToReturn.municipios[municipioIndex].sedes[
              sedeIndex
            ].grados.push({
              id: this.parserService.gradesFromNumberToString(
                departmentWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: departmentWithInstelligences[key].intelligence_name,
                  cantidadDeEstudiantes:
                    departmentWithInstelligences[key].total_students,
                  indicador:
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
                id: this.parserService.gradesFromNumberToString(
                  departmentWithInstelligences[key].grade_id,
                ),
                asignatura: [],
                inteligencias: [
                  {
                    id: departmentWithInstelligences[key].intelligence_name,
                    cantidadDeEstudiantes:
                      departmentWithInstelligences[key].total_students,
                    indicador:
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
              this.parserService.gradesFromNumberToString(
                departmentWithStyles[key].grade_id,
              ),
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
                cantidadDeEstudiantes: departmentWithStyles[key].total_students,
                puntos: departmentWithStyles[key].style_average,
              });
            }
          } else {
            dataToReturn.municipios[municipioIndex].sedes[
              sedeIndex
            ].grados.push({
              id: this.parserService.gradesFromNumberToString(
                departmentWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: departmentWithStyles[key].style_name,
                  cantidadDeEstudiantes:
                    departmentWithStyles[key].total_students,
                  puntos: departmentWithStyles[key].style_average,
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
                id: this.parserService.gradesFromNumberToString(
                  departmentWithStyles[key].grade_id,
                ),
                asignatura: [],
                inteligencias: [],
                estilos: [
                  {
                    id: departmentWithStyles[key].style_name,
                    cantidadDeEstudiantes:
                      departmentWithStyles[key].total_students,
                    puntos: departmentWithStyles[key].style_average,
                  },
                ],
                vocaciones: [],
              },
            ],
          });
        }
      }
    }

    for (const key in departmentWithVocations) {
      const municipioIndex = dataToReturn.municipios
        .map((municipio) => municipio.id)
        .indexOf(departmentWithVocations[key].town_name);
      if (municipioIndex != -1) {
        const sedeIndex = dataToReturn.municipios[municipioIndex].sedes
          .map((sede) => sede.id)
          .indexOf(departmentWithVocations[key].headquarter_name);
        if (sedeIndex != -1) {
          const gradeIndex = dataToReturn.municipios[municipioIndex].sedes[
            sedeIndex
          ].grados
            .map((grade) => grade.id)
            .indexOf(
              this.parserService.gradesFromNumberToString(
                departmentWithVocations[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            const notIntelligenceFound =
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].vocaciones
                .map((inteligencia) => inteligencia.id)
                .indexOf(departmentWithVocations[key].vocational_name) == -1;
            if (notIntelligenceFound) {
              dataToReturn.municipios[municipioIndex].sedes[sedeIndex].grados[
                gradeIndex
              ].vocaciones.push({
                id: departmentWithVocations[key].vocational_name,
                cantidadDeEstudiantes:
                  departmentWithVocations[key].total_students,
                puntos: departmentWithVocations[key].vocational_average,
              });
            }
          } else {
            dataToReturn.municipios[municipioIndex].sedes[
              sedeIndex
            ].grados.push({
              id: this.parserService.gradesFromNumberToString(
                departmentWithVocations[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [],
              vocaciones: [
                {
                  id: departmentWithVocations[key].vocational_name,
                  cantidadDeEstudiantes:
                    departmentWithVocations[key].total_students,
                  puntos: departmentWithVocations[key].vocational_average,
                },
              ],
            });
          }
        } else {
          dataToReturn.municipios[municipioIndex].sedes.push({
            id: departmentWithVocations[key].headquarter_name,
            institutcion: departmentWithVocations[key].institution_name,
            grados: [
              {
                id: this.parserService.gradesFromNumberToString(
                  departmentWithVocations[key].grade_id,
                ),
                asignatura: [],
                inteligencias: [],
                estilos: [],
                vocaciones: [
                  {
                    id: departmentWithVocations[key].vocational_name,
                    cantidadDeEstudiantes:
                      departmentWithVocations[key].total_students,
                    puntos: departmentWithVocations[key].vocational_average,
                  },
                ],
              },
            ],
          });
        }
      }
    }

    return dataToReturn;
  }

  async getDashboardDataByInstitution(institutionId) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const institutionWithAsignatures =
      await this.queriesService.getDataWithAsignatures(
        institutionId,
        FilterType.INSTITUTION,
      );

    const institutionWithInstelligences =
      await this.queriesService.getDataWithInstelligences(
        institutionId,
        FilterType.INSTITUTION,
      );

    const institutionWithStyles = await this.queriesService.getDataWithStyles(
      institutionId,
      FilterType.INSTITUTION,
    );

    const institutionWithVocations =
      await this.queriesService.getDataWithVocations(
        institutionId,
        FilterType.INSTITUTION,
      );

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
                  id: this.parserService.gradesFromNumberToString(
                    institutionWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: institutionWithAsignatures[key].subject_name,
                      cantidadDeEstudiantes:
                        institutionWithAsignatures[key].total_students,
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
              this.parserService.gradesFromNumberToString(
                institutionWithAsignatures[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].asignatura.push({
              id: institutionWithAsignatures[key].subject_name,
              cantidadDeEstudiantes:
                institutionWithAsignatures[key].total_students,
              promedio: institutionWithAsignatures[key].subject_average,
            });
          } else {
            dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
              id: this.parserService.gradesFromNumberToString(
                institutionWithAsignatures[key].grade_id,
              ),
              asignatura: [
                {
                  id: institutionWithAsignatures[key].subject_name,
                  cantidadDeEstudiantes:
                    institutionWithAsignatures[key].total_students,
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
                id: this.parserService.gradesFromNumberToString(
                  institutionWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: institutionWithAsignatures[key].subject_name,
                    cantidadDeEstudiantes:
                      institutionWithAsignatures[key].total_students,
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
            this.parserService.gradesFromNumberToString(
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
              cantidadDeEstudiantes:
                institutionWithInstelligences[key].total_students,
              indicador:
                institutionWithInstelligences[key].intelligence_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              institutionWithInstelligences[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [
              {
                id: institutionWithInstelligences[key].intelligence_name,
                cantidadDeEstudiantes:
                  institutionWithInstelligences[key].total_students,
                indicador:
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
              id: this.parserService.gradesFromNumberToString(
                institutionWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: institutionWithInstelligences[key].intelligence_name,
                  cantidadDeEstudiantes:
                    institutionWithInstelligences[key].total_students,
                  indicador:
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
            this.parserService.gradesFromNumberToString(
              institutionWithStyles[key].grade_id,
            ),
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
              cantidadDeEstudiantes: institutionWithStyles[key].total_students,
              puntos: institutionWithStyles[key].style_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              institutionWithStyles[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [
              {
                id: institutionWithStyles[key].style_name,
                cantidadDeEstudiantes:
                  institutionWithStyles[key].total_students,
                puntos: institutionWithStyles[key].style_average,
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
              id: this.parserService.gradesFromNumberToString(
                institutionWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: institutionWithStyles[key].style_name,
                  cantidadDeEstudiantes:
                    institutionWithStyles[key].total_students,
                  puntos: institutionWithStyles[key].style_average,
                },
              ],
              vocaciones: [],
            },
          ],
        });
      }
    }

    for (const key in institutionWithVocations) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(institutionWithVocations[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.parserService.gradesFromNumberToString(
              institutionWithVocations[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notIntelligenceFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].vocaciones
              .map((inteligencia) => inteligencia.id)
              .indexOf(institutionWithVocations[key].vocational_name) == -1;
          if (notIntelligenceFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].vocaciones.push({
              id: institutionWithVocations[key].vocational_name,
              cantidadDeEstudiantes:
                institutionWithVocations[key].total_students,
              puntos: institutionWithVocations[key].vocational_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              institutionWithVocations[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [],
            vocaciones: [
              {
                id: institutionWithVocations[key].vocational_name,
                cantidadDeEstudiantes:
                  institutionWithVocations[key].total_students,
                puntos: institutionWithVocations[key].vocational_average,
              },
            ],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: institutionWithVocations[key].headquarter_name,
          institutcion: institutionWithVocations[key].institution_name,
          grados: [
            {
              id: this.parserService.gradesFromNumberToString(
                institutionWithVocations[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [],
              vocaciones: [
                {
                  id: institutionWithVocations[key].vocational_name,
                  cantidadDeEstudiantes:
                    institutionWithVocations[key].total_students,
                  puntos: institutionWithVocations[key].vocational_average,
                },
              ],
            },
          ],
        });
      }
    }

    return dataToReturn;
  }

  async getDashboardDataByHeadquarter(headquarterId) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const headquarterWithAsignatures =
      await this.queriesService.getDataWithAsignatures(
        headquarterId,
        FilterType.HEADQUARTER,
      );

    const headquarterWithInstelligences =
      await this.queriesService.getDataWithInstelligences(
        headquarterId,
        FilterType.HEADQUARTER,
      );

    const headquarterWithStyles = await this.queriesService.getDataWithStyles(
      headquarterId,
      FilterType.HEADQUARTER,
    );

    const headquarterWithVocations =
      await this.queriesService.getDataWithVocations(
        headquarterId,
        FilterType.HEADQUARTER,
      );

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
                  id: this.parserService.gradesFromNumberToString(
                    headquarterWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: headquarterWithAsignatures[key].subject_name,
                      cantidadDeEstudiantes:
                        headquarterWithAsignatures[key].total_students,
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
              this.parserService.gradesFromNumberToString(
                headquarterWithAsignatures[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].asignatura.push({
              id: headquarterWithAsignatures[key].subject_name,
              cantidadDeEstudiantes:
                headquarterWithAsignatures[key].total_students,
              promedio: headquarterWithAsignatures[key].subject_average,
            });
          } else {
            dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
              id: this.parserService.gradesFromNumberToString(
                headquarterWithAsignatures[key].grade_id,
              ),
              asignatura: [
                {
                  id: headquarterWithAsignatures[key].subject_name,
                  cantidadDeEstudiantes:
                    headquarterWithAsignatures[key].total_students,
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
                id: this.parserService.gradesFromNumberToString(
                  headquarterWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: headquarterWithAsignatures[key].subject_name,
                    cantidadDeEstudiantes:
                      headquarterWithAsignatures[key].total_students,
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
            this.parserService.gradesFromNumberToString(
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
              cantidadDeEstudiantes:
                headquarterWithInstelligences[key].total_students,
              indicador:
                headquarterWithInstelligences[key].intelligence_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              headquarterWithInstelligences[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [
              {
                id: headquarterWithInstelligences[key].intelligence_name,
                cantidadDeEstudiantes:
                  headquarterWithInstelligences[key].total_students,
                indicador:
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
              id: this.parserService.gradesFromNumberToString(
                headquarterWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: headquarterWithInstelligences[key].intelligence_name,
                  cantidadDeEstudiantes:
                    headquarterWithInstelligences[key].total_students,
                  indicador:
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
            this.parserService.gradesFromNumberToString(
              headquarterWithStyles[key].grade_id,
            ),
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
              cantidadDeEstudiantes: headquarterWithStyles[key].total_students,
              puntos: headquarterWithStyles[key].style_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              headquarterWithStyles[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [
              {
                id: headquarterWithStyles[key].style_name,
                cantidadDeEstudiantes:
                  headquarterWithStyles[key].total_students,
                puntos: headquarterWithStyles[key].style_average,
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
              id: this.parserService.gradesFromNumberToString(
                headquarterWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: headquarterWithStyles[key].style_name,
                  cantidadDeEstudiantes:
                    headquarterWithStyles[key].total_students,
                  puntos: headquarterWithStyles[key].style_average,
                },
              ],
              vocaciones: [],
            },
          ],
        });
      }
    }

    for (const key in headquarterWithVocations) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(headquarterWithVocations[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.parserService.gradesFromNumberToString(
              headquarterWithVocations[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notIntelligenceFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].vocaciones
              .map((inteligencia) => inteligencia.id)
              .indexOf(headquarterWithVocations[key].vocational_name) == -1;
          if (notIntelligenceFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].vocaciones.push({
              id: headquarterWithVocations[key].vocational_name,
              cantidadDeEstudiantes:
                headquarterWithVocations[key].total_students,
              puntos: headquarterWithVocations[key].vocational_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              headquarterWithVocations[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [],
            vocaciones: [
              {
                id: headquarterWithVocations[key].vocational_name,
                cantidadDeEstudiantes:
                  headquarterWithVocations[key].total_students,
                puntos: headquarterWithVocations[key].vocational_average,
              },
            ],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: headquarterWithVocations[key].headquarter_name,
          institutcion: headquarterWithVocations[key].institution_name,
          grados: [
            {
              id: this.parserService.gradesFromNumberToString(
                headquarterWithVocations[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [],
              vocaciones: [
                {
                  id: headquarterWithVocations[key].vocational_name,
                  cantidadDeEstudiantes:
                    headquarterWithVocations[key].total_students,
                  puntos: headquarterWithVocations[key].vocational_average,
                },
              ],
            },
          ],
        });
      }
    }

    return dataToReturn;
  }

  async getDashboardDataByTown(townId) {
    const dataToReturn = {
      departamento: 'Valle del Cauca',
      municipios: [],
    };

    const townWithAsignatures =
      await this.queriesService.getDataWithAsignatures(townId, FilterType.TOWN);

    const townWithInstelligences =
      await this.queriesService.getDataWithInstelligences(
        townId,
        FilterType.TOWN,
      );

    const townWithStyles = await this.queriesService.getTownWithStyles(townId);

    const townWithVocations = await this.queriesService.getDataWithVocations(
      townId,
      FilterType.TOWN,
    );

    for (const key in townWithAsignatures) {
      if (dataToReturn.municipios.length === 0) {
        dataToReturn.municipios.push({
          id: townWithAsignatures[key].town_name,
          sedes: [
            {
              id: townWithAsignatures[key].headquarter_name,
              institutcion: townWithAsignatures[key].institution_name,
              grados: [
                {
                  id: this.parserService.gradesFromNumberToString(
                    townWithAsignatures[key].grade_id,
                  ),
                  asignatura: [
                    {
                      id: townWithAsignatures[key].subject_name,
                      cantidadDeEstudiantes:
                        townWithAsignatures[key].total_students,
                      promedio: townWithAsignatures[key].subject_average,
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
          .indexOf(townWithAsignatures[key].headquarter_name);

        if (sedeIndex != -1) {
          const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
            .map((grade) => grade.id)
            .indexOf(
              this.parserService.gradesFromNumberToString(
                townWithAsignatures[key].grade_id,
              ),
            );

          if (gradeIndex != -1) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].asignatura.push({
              id: townWithAsignatures[key].subject_name,
              cantidadDeEstudiantes: townWithAsignatures[key].total_students,
              promedio: townWithAsignatures[key].subject_average,
            });
          } else {
            dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
              id: this.parserService.gradesFromNumberToString(
                townWithAsignatures[key].grade_id,
              ),
              asignatura: [
                {
                  id: townWithAsignatures[key].subject_name,
                  cantidadDeEstudiantes:
                    townWithAsignatures[key].total_students,
                  promedio: townWithAsignatures[key].subject_average,
                },
              ],
              inteligencias: [],
              estilos: [],
              vocaciones: [],
            });
          }
        } else {
          dataToReturn.municipios[0].sedes.push({
            id: townWithAsignatures[key].headquarter_name,
            institutcion: townWithAsignatures[key].institution_name,
            grados: [
              {
                id: this.parserService.gradesFromNumberToString(
                  townWithAsignatures[key].grade_id,
                ),
                asignatura: [
                  {
                    id: townWithAsignatures[key].subject_name,
                    cantidadDeEstudiantes:
                      townWithAsignatures[key].total_students,
                    promedio: townWithAsignatures[key].subject_average,
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

    for (const key in townWithInstelligences) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(townWithInstelligences[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.parserService.gradesFromNumberToString(
              townWithInstelligences[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notIntelligenceFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias
              .map((inteligencia) => inteligencia.id)
              .indexOf(townWithInstelligences[key].intelligence_name) == -1;
          if (notIntelligenceFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].inteligencias.push({
              id: townWithInstelligences[key].intelligence_name,
              cantidadDeEstudiantes: townWithInstelligences[key].total_students,
              indicador: townWithInstelligences[key].intelligence_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              townWithInstelligences[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [
              {
                id: townWithInstelligences[key].intelligence_name,
                cantidadDeEstudiantes:
                  townWithInstelligences[key].total_students,
                indicador: townWithInstelligences[key].intelligence_average,
              },
            ],
            estilos: [],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: townWithInstelligences[key].headquarter_name,
          institutcion: townWithInstelligences[key].institution_name,
          grados: [
            {
              id: this.parserService.gradesFromNumberToString(
                townWithInstelligences[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [
                {
                  id: townWithInstelligences[key].intelligence_name,
                  cantidadDeEstudiantes:
                    townWithInstelligences[key].total_students,
                  indicador: townWithInstelligences[key].intelligence_average,
                },
              ],
              estilos: [],
              vocaciones: [],
            },
          ],
        });
      }
    }

    for (const key in townWithStyles) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(townWithStyles[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.parserService.gradesFromNumberToString(
              townWithStyles[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notStyleFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos
              .map((inteligencia) => inteligencia.id)
              .indexOf(townWithStyles[key].style_name) == -1;
          if (notStyleFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].estilos.push({
              id: townWithStyles[key].style_name,
              cantidadDeEstudiantes: townWithStyles[key].total_students,
              puntos: townWithStyles[key].style_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              townWithStyles[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [
              {
                id: townWithStyles[key].style_name,
                cantidadDeEstudiantes: townWithStyles[key].total_students,
                puntos: townWithStyles[key].style_average,
              },
            ],
            vocaciones: [],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: townWithStyles[key].headquarter_name,
          institutcion: townWithStyles[key].institution_name,
          grados: [
            {
              id: this.parserService.gradesFromNumberToString(
                townWithStyles[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [
                {
                  id: townWithStyles[key].style_name,
                  cantidadDeEstudiantes: townWithStyles[key].total_students,
                  puntos: townWithStyles[key].style_average,
                },
              ],
              vocaciones: [],
            },
          ],
        });
      }
    }

    for (const key in townWithVocations) {
      const sedeIndex = dataToReturn.municipios[0].sedes
        .map((sede) => sede.id)
        .indexOf(townWithVocations[key].headquarter_name);
      if (sedeIndex != -1) {
        const gradeIndex = dataToReturn.municipios[0].sedes[sedeIndex].grados
          .map((grade) => grade.id)
          .indexOf(
            this.parserService.gradesFromNumberToString(
              townWithVocations[key].grade_id,
            ),
          );

        if (gradeIndex != -1) {
          const notIntelligenceFound =
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].vocaciones
              .map((inteligencia) => inteligencia.id)
              .indexOf(townWithVocations[key].vocational_name) == -1;
          if (notIntelligenceFound) {
            dataToReturn.municipios[0].sedes[sedeIndex].grados[
              gradeIndex
            ].vocaciones.push({
              id: townWithVocations[key].vocational_name,
              cantidadDeEstudiantes: townWithVocations[key].total_students,
              puntos: townWithVocations[key].vocational_average,
            });
          }
        } else {
          dataToReturn.municipios[0].sedes[sedeIndex].grados.push({
            id: this.parserService.gradesFromNumberToString(
              townWithVocations[key].grade_id,
            ),
            asignatura: [],
            inteligencias: [],
            estilos: [],
            vocaciones: [
              {
                id: townWithVocations[key].vocational_name,
                cantidadDeEstudiantes: townWithVocations[key].total_students,
                puntos: townWithVocations[key].vocational_average,
              },
            ],
          });
        }
      } else {
        dataToReturn.municipios[0].sedes.push({
          id: townWithVocations[key].headquarter_name,
          institutcion: townWithVocations[key].institution_name,
          grados: [
            {
              id: this.parserService.gradesFromNumberToString(
                townWithVocations[key].grade_id,
              ),
              asignatura: [],
              inteligencias: [],
              estilos: [],
              vocaciones: [
                {
                  id: townWithVocations[key].vocational_name,
                  cantidadDeEstudiantes: townWithVocations[key].total_students,
                  puntos: townWithVocations[key].vocational_average,
                },
              ],
            },
          ],
        });
      }
    }

    return dataToReturn;
  }
}
