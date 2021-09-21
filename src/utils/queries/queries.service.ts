import { Injectable } from '@nestjs/common';
import { FilterType } from 'src/dashboard/dashboard-filter-type.enum';
import { getManager } from 'typeorm';

@Injectable()
export class QueriesService {
  private manager = getManager();
  async getDataWithAsignatures(id, filterType: FilterType) {
    return this.manager.query(`
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
        ROUND(AVG(GUR.total_score), 2) as 'subject_average',
        COUNT(GU.first_name) as 'total_students'
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
      WHERE ${filterType}.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (S.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (S.name)
    `);
  }

  async getDataWithInstelligences(id, filterType: FilterType) {
    return this.manager.query(`
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
        ROUND(AVG(GUI.percentage_value), 2) as 'intelligence_average',
        COUNT(GU.id) as 'total_students'
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
      WHERE ${filterType}.id = ${id}
      GROUP BY (TW.id), (IT.id), (HQ.id), (GU.grade_id), (I.id)
      ORDER BY (TW.name), (HQ.id), (GU.grade_id), (I.name)
    `);
  }

  async getDataWithStyles(id, filterType: FilterType) {
    return this.manager.query(`
      SELECT 
        TSBUS.institutions_id,
        TSBUS.institutions_name,
        TSBUS.headquarter_id,
        TSBUS.headquarter_name,
        TSBUS.grade_id,
        S.name as 'style_name',
        ROUND(AVG(TSBUS.total_by_area/TSBU.total_by_user), 2) * 100 as 'style_average',
        COUNT(TSBUS.game_user_id) as 'total_students'
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
            WHERE ${filterType}.id = ${id}
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
            WHERE ${filterType}.id = ${id}
            GROUP BY (GU.id)
        ) AS TSBU 
          ON TSBUS.game_user_id = TSBU.id
        JOIN talentumehs_valle_magico.styles S
          ON TSBUS.style = S.id
        GROUP BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style), (TSBUS.grade_id)
        ORDER BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style)
    `);
  }

  async getTownWithStyles(townId) {
    return this.manager.query(`
      SELECT 
        TSBUS.institutions_id,
        TSBUS.institutions_name,
        TSBUS.headquarter_id,
        TSBUS.headquarter_name,
        TSBUS.grade_id,
        S.name as 'style_name',
        ROUND(AVG(TSBUS.total_by_area/TSBU.total_by_user), 2) * 100 as 'style_average',
        COUNT(TSBUS.game_user_id) as 'total_students'
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
            WHERE TW.id = ${townId}
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
            WHERE TW.id = ${townId}
            GROUP BY (GU.id)
        ) AS TSBU 
          ON TSBUS.game_user_id = TSBU.id
        JOIN talentumehs_valle_magico.styles S
          ON TSBUS.style = S.id
        GROUP BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style), (TSBUS.grade_id)
        ORDER BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style)
    `);
  }

  async getDepartmentWithStyles(departmentId) {
    return this.manager.query(`
    SELECT 
      TSBUS.town_id,
      TSBUS.town_name,
      TSBUS.institutions_id,
      TSBUS.institutions_name,
      TSBUS.headquarter_id,
      TSBUS.headquarter_name,
      TSBUS.grade_id,
      S.name as 'style_name',
      ROUND(AVG(TSBUS.total_by_area/TSBU.total_by_user), 2) * 100 as 'style_average',
      COUNT(TSBUS.game_user_id) as 'total_students'
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
          WHERE DP.id = ${departmentId}
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
          WHERE DP.id = ${departmentId}
          GROUP BY (GU.id)
      ) AS TSBU 
        ON TSBUS.game_user_id = TSBU.id
      JOIN talentumehs_valle_magico.styles S
        ON TSBUS.style = S.id
      GROUP BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style), (TSBUS.grade_id)
      ORDER BY (TSBUS.institutions_id), (TSBUS.headquarter_id), (TSBUS.style)
    `);
  }

  async getDataWithVocations(departmentId, filterType: FilterType) {
    return this.manager.query(`
      SELECT 
      TOBUO.department_id as 'department_id',
      TOBUO.department_name as 'department_name', 
      TOBUO.town_id as 'town_id',
      TOBUO.town_name as 'town_name',
      TOBUO.institution_id as 'institution_id',
      TOBUO.institution_name as 'institution_name', 
      TOBUO.headquarter_id as 'headquarter_id',
      TOBUO.headquarter_name as 'headquarter_name',
      TOBUO.grade_id as 'grade_id',
      VO.name as 'vocational_name',
      ROUND(AVG(TOBUO.total_by_orientation/TVBU.total_by_user), 2) * 100 as 'vocational_average',
      COUNT(TOBUO.game_user_id) as 'total_students'
      FROM (
        SELECT
          GU.grade_id as 'grade_id',
          DP.id as 'department_id',
          DP.name as 'department_name',
          TW.id as 'town_id',
          TW.name as 'town_name',
          IT.id as 'institution_id',
          IT.name as 'institution_name',
          HQ.id as 'headquarter_id',
          HQ.name as 'headquarter_name',
          GU.id as 'game_user_id',
          VO.id as 'vocational_orientation',
          COUNT(GUIDS.id) as 'total_by_orientation'
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
          JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUIDS
            ON GUIDS.game_user_record_id = GUR.id
          JOIN talentumehs_valle_magico.vocationals_orientations VO
            ON GUIDS.vocational_orientation_id = VO.id
          WHERE ${filterType}.id = ${departmentId}
          GROUP BY (VO.id), (GU.id)
      ) as TOBUO
      JOIN (
        SELECT
          DP.id as 'department_id',
          DP.name as 'department_name',
          TW.id as 'town_id',
          TW.name as 'town_name',
          IT.id as 'institution_id',
          IT.name as 'institution_name',
          HQ.id as 'headquarter_id',
          HQ.name as 'headquarter_name',
          GU.id,
          COUNT(GUIDS.id) as 'total_by_user'
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
          JOIN talentumehs_valle_magico.gu_record_intelligence_ind_desc_styles GUIDS
            ON GUIDS.game_user_record_id = GUR.id
          JOIN talentumehs_valle_magico.vocationals_orientations VO
            ON GUIDS.vocational_orientation_id = VO.id
          WHERE ${filterType}.id = ${departmentId}
          GROUP BY (GU.id)
      ) as TVBU
        ON TOBUO.game_user_id = TVBU.id
      RIGHT JOIN talentumehs_valle_magico.vocationals_orientations VO
        ON TOBUO.vocational_orientation = VO.id
      GROUP BY (VO.id), institution_id, headquarter_id, grade_id
      ORDER BY institution_id, headquarter_id, grade_id, (VO.name), (vocational_average)
    `);
  }
}
