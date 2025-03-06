export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brand_guides: {
        Row: {
          accent_color: string | null
          additional_colors: Json | null
          asset_urls: Json | null
          background_color: string | null
          body_text_styles: Json | null
          brand_values: Json | null
          company_name: string
          created_at: string | null
          email: string
          heading_styles: Json | null
          icon_style: string | null
          id: string
          imagery_style: string | null
          last_modified_by: string | null
          logo_url: string | null
          logo_usage_guidelines: string | null
          logo_variations: Json | null
          pattern_guidelines: string | null
          primary_color: string | null
          primary_font: string | null
          secondary_color: string | null
          secondary_font: string | null
          status: string | null
          text_color: string | null
          tone_of_voice: string | null
          updated_at: string | null
          user_name: string
          version: number | null
          writing_style_guide: string | null
        }
        Insert: {
          accent_color?: string | null
          additional_colors?: Json | null
          asset_urls?: Json | null
          background_color?: string | null
          body_text_styles?: Json | null
          brand_values?: Json | null
          company_name: string
          created_at?: string | null
          email: string
          heading_styles?: Json | null
          icon_style?: string | null
          id?: string
          imagery_style?: string | null
          last_modified_by?: string | null
          logo_url?: string | null
          logo_usage_guidelines?: string | null
          logo_variations?: Json | null
          pattern_guidelines?: string | null
          primary_color?: string | null
          primary_font?: string | null
          secondary_color?: string | null
          secondary_font?: string | null
          status?: string | null
          text_color?: string | null
          tone_of_voice?: string | null
          updated_at?: string | null
          user_name: string
          version?: number | null
          writing_style_guide?: string | null
        }
        Update: {
          accent_color?: string | null
          additional_colors?: Json | null
          asset_urls?: Json | null
          background_color?: string | null
          body_text_styles?: Json | null
          brand_values?: Json | null
          company_name?: string
          created_at?: string | null
          email?: string
          heading_styles?: Json | null
          icon_style?: string | null
          id?: string
          imagery_style?: string | null
          last_modified_by?: string | null
          logo_url?: string | null
          logo_usage_guidelines?: string | null
          logo_variations?: Json | null
          pattern_guidelines?: string | null
          primary_color?: string | null
          primary_font?: string | null
          secondary_color?: string | null
          secondary_font?: string | null
          status?: string | null
          text_color?: string | null
          tone_of_voice?: string | null
          updated_at?: string | null
          user_name?: string
          version?: number | null
          writing_style_guide?: string | null
        }
        Relationships: []
      }
      business_actuals: {
        Row: {
          created_at: string | null
          customer_retention: number
          customer_satisfaction: number
          expenses: number
          game_session_id: string
          id: string
          market_share: number
          marketing_effectiveness: number
          marketing_roi: number
          month: number
          nps: number
          productivity: number
          profit: number
          revenue: number
          team_satisfaction: number
        }
        Insert: {
          created_at?: string | null
          customer_retention: number
          customer_satisfaction: number
          expenses: number
          game_session_id: string
          id?: string
          market_share: number
          marketing_effectiveness: number
          marketing_roi: number
          month: number
          nps: number
          productivity: number
          profit: number
          revenue: number
          team_satisfaction: number
        }
        Update: {
          created_at?: string | null
          customer_retention?: number
          customer_satisfaction?: number
          expenses?: number
          game_session_id?: string
          id?: string
          market_share?: number
          marketing_effectiveness?: number
          marketing_roi?: number
          month?: number
          nps?: number
          productivity?: number
          profit?: number
          revenue?: number
          team_satisfaction?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_actuals_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      business_forecasts: {
        Row: {
          created_at: string | null
          customer_retention_target: number
          customer_satisfaction_target: number
          expenses_target: number
          game_session_id: string
          id: string
          market_share_target: number
          marketing_effectiveness_target: number
          marketing_roi_target: number
          nps_target: number
          productivity_target: number
          profit_target: number
          quarter: number
          revenue_target: number
          team_satisfaction_target: number
        }
        Insert: {
          created_at?: string | null
          customer_retention_target: number
          customer_satisfaction_target: number
          expenses_target: number
          game_session_id: string
          id?: string
          market_share_target: number
          marketing_effectiveness_target: number
          marketing_roi_target: number
          nps_target: number
          productivity_target: number
          profit_target: number
          quarter: number
          revenue_target: number
          team_satisfaction_target: number
        }
        Update: {
          created_at?: string | null
          customer_retention_target?: number
          customer_satisfaction_target?: number
          expenses_target?: number
          game_session_id?: string
          id?: string
          market_share_target?: number
          marketing_effectiveness_target?: number
          marketing_roi_target?: number
          nps_target?: number
          productivity_target?: number
          profit_target?: number
          quarter?: number
          revenue_target?: number
          team_satisfaction_target?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_forecasts_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      business_simulations: {
        Row: {
          company_name: string
          created_at: string | null
          currency: string
          decisions_analysis: Json | null
          email: string
          final_budget: number
          final_customer_satisfaction: number
          final_market_share: number
          final_revenue: number
          group_id: string | null
          id: string
          marketing_effectiveness: number
          operational_efficiency: number
          team_satisfaction: number
          total_employees: number
          user_name: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          currency?: string
          decisions_analysis?: Json | null
          email: string
          final_budget: number
          final_customer_satisfaction: number
          final_market_share: number
          final_revenue: number
          group_id?: string | null
          id?: string
          marketing_effectiveness: number
          operational_efficiency: number
          team_satisfaction: number
          total_employees: number
          user_name: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          currency?: string
          decisions_analysis?: Json | null
          email?: string
          final_budget?: number
          final_customer_satisfaction?: number
          final_market_share?: number
          final_revenue?: number
          group_id?: string | null
          id?: string
          marketing_effectiveness?: number
          operational_efficiency?: number
          team_satisfaction?: number
          total_employees?: number
          user_name?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          assessment_id: string | null
          company: string
          created_at: string | null
          email: string
          id: string
          name: string
          newsletter: boolean | null
          phone: string | null
          risk_level: string
          submission_type: string
        }
        Insert: {
          assessment_id?: string | null
          company: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          newsletter?: boolean | null
          phone?: string | null
          risk_level: string
          submission_type: string
        }
        Update: {
          assessment_id?: string | null
          company?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          newsletter?: boolean | null
          phone?: string | null
          risk_level?: string
          submission_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "ss_tool_risk"
            referencedColumns: ["id"]
          },
        ]
      }
      disc_assessments: {
        Row: {
          answers: Json | null
          conscientiousness_score: number
          created_at: string | null
          dominance_score: number
          email: string
          id: string
          influence_score: number
          organization: string | null
          steadiness_score: number
          total_score: number
          updated_at: string | null
          user_name: string
        }
        Insert: {
          answers?: Json | null
          conscientiousness_score: number
          created_at?: string | null
          dominance_score: number
          email: string
          id?: string
          influence_score: number
          organization?: string | null
          steadiness_score: number
          total_score: number
          updated_at?: string | null
          user_name: string
        }
        Update: {
          answers?: Json | null
          conscientiousness_score?: number
          created_at?: string | null
          dominance_score?: number
          email?: string
          id?: string
          influence_score?: number
          organization?: string | null
          steadiness_score?: number
          total_score?: number
          updated_at?: string | null
          user_name?: string
        }
        Relationships: []
      }
      form_completions: {
        Row: {
          agency_email: string | null
          agency_name: string
          analysis: Json | null
          created_at: string | null
          currency: string | null
          decision_maker_role: string
          id: string
          name: string
          newsletter: boolean | null
          project_type: string | null
          project_value: number | null
          sale_type: string
          total_score: number
          updated_at: string | null
        }
        Insert: {
          agency_email?: string | null
          agency_name: string
          analysis?: Json | null
          created_at?: string | null
          currency?: string | null
          decision_maker_role: string
          id?: string
          name: string
          newsletter?: boolean | null
          project_type?: string | null
          project_value?: number | null
          sale_type: string
          total_score: number
          updated_at?: string | null
        }
        Update: {
          agency_email?: string | null
          agency_name?: string
          analysis?: Json | null
          created_at?: string | null
          currency?: string | null
          decision_maker_role?: string
          id?: string
          name?: string
          newsletter?: boolean | null
          project_type?: string | null
          project_value?: number | null
          sale_type?: string
          total_score?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          active_upgrades: Json | null
          automation_level: number | null
          brand_reputation: number | null
          budget_allocation: Json | null
          burnout_risk: number | null
          business_type: string
          cash_flow: number | null
          company_name: string
          created_at: string | null
          currency: string
          customer_metrics: Json | null
          customer_satisfaction: number | null
          debt_management: number | null
          diversity_level: number | null
          email: string | null
          employee_metrics: Json | null
          employee_satisfaction: number | null
          employee_skill_level: number | null
          employees: Json | null
          expenses: number | null
          financial_metrics: Json | null
          group_id: string | null
          hiring_strategy: number | null
          id: string
          inventory: number | null
          inventory_level: number | null
          loan_amount: number
          loan_type: string
          loans: number | null
          maintenance_level: number | null
          market_share: number | null
          marketing_budget: Json | null
          marketing_roi: Json | null
          month: number | null
          one_off_decisions: Json | null
          operating_costs: Json | null
          outsourcing_level: number | null
          perks_level: number | null
          pricing_strategy: number | null
          product_quality: number | null
          production_rate: number | null
          profit_distribution: Json | null
          quality_control: number | null
          remote_work_level: number | null
          research_points: number | null
          revenue: number | null
          risk_management: number | null
          sales_tax: number | null
          shift_schedule: number | null
          status: string | null
          supply_chain: Json | null
          tax_rate: number | null
          team_cohesion: number | null
          team_satisfaction: number | null
          training_level: number | null
          updated_at: string | null
          user_name: string
          workforce_skill: number | null
          workload_level: number | null
        }
        Insert: {
          active_upgrades?: Json | null
          automation_level?: number | null
          brand_reputation?: number | null
          budget_allocation?: Json | null
          burnout_risk?: number | null
          business_type: string
          cash_flow?: number | null
          company_name: string
          created_at?: string | null
          currency?: string
          customer_metrics?: Json | null
          customer_satisfaction?: number | null
          debt_management?: number | null
          diversity_level?: number | null
          email?: string | null
          employee_metrics?: Json | null
          employee_satisfaction?: number | null
          employee_skill_level?: number | null
          employees?: Json | null
          expenses?: number | null
          financial_metrics?: Json | null
          group_id?: string | null
          hiring_strategy?: number | null
          id?: string
          inventory?: number | null
          inventory_level?: number | null
          loan_amount?: number
          loan_type?: string
          loans?: number | null
          maintenance_level?: number | null
          market_share?: number | null
          marketing_budget?: Json | null
          marketing_roi?: Json | null
          month?: number | null
          one_off_decisions?: Json | null
          operating_costs?: Json | null
          outsourcing_level?: number | null
          perks_level?: number | null
          pricing_strategy?: number | null
          product_quality?: number | null
          production_rate?: number | null
          profit_distribution?: Json | null
          quality_control?: number | null
          remote_work_level?: number | null
          research_points?: number | null
          revenue?: number | null
          risk_management?: number | null
          sales_tax?: number | null
          shift_schedule?: number | null
          status?: string | null
          supply_chain?: Json | null
          tax_rate?: number | null
          team_cohesion?: number | null
          team_satisfaction?: number | null
          training_level?: number | null
          updated_at?: string | null
          user_name: string
          workforce_skill?: number | null
          workload_level?: number | null
        }
        Update: {
          active_upgrades?: Json | null
          automation_level?: number | null
          brand_reputation?: number | null
          budget_allocation?: Json | null
          burnout_risk?: number | null
          business_type?: string
          cash_flow?: number | null
          company_name?: string
          created_at?: string | null
          currency?: string
          customer_metrics?: Json | null
          customer_satisfaction?: number | null
          debt_management?: number | null
          diversity_level?: number | null
          email?: string | null
          employee_metrics?: Json | null
          employee_satisfaction?: number | null
          employee_skill_level?: number | null
          employees?: Json | null
          expenses?: number | null
          financial_metrics?: Json | null
          group_id?: string | null
          hiring_strategy?: number | null
          id?: string
          inventory?: number | null
          inventory_level?: number | null
          loan_amount?: number
          loan_type?: string
          loans?: number | null
          maintenance_level?: number | null
          market_share?: number | null
          marketing_budget?: Json | null
          marketing_roi?: Json | null
          month?: number | null
          one_off_decisions?: Json | null
          operating_costs?: Json | null
          outsourcing_level?: number | null
          perks_level?: number | null
          pricing_strategy?: number | null
          product_quality?: number | null
          production_rate?: number | null
          profit_distribution?: Json | null
          quality_control?: number | null
          remote_work_level?: number | null
          research_points?: number | null
          revenue?: number | null
          risk_management?: number | null
          sales_tax?: number | null
          shift_schedule?: number | null
          status?: string | null
          supply_chain?: Json | null
          tax_rate?: number | null
          team_cohesion?: number | null
          team_satisfaction?: number | null
          training_level?: number | null
          updated_at?: string | null
          user_name?: string
          workforce_skill?: number | null
          workload_level?: number | null
        }
        Relationships: []
      }
      lean_canvas_submissions: {
        Row: {
          analysis: Json | null
          created_at: string | null
          form_data: string
          id: string
          pdf_path: string | null
          updated_at: string | null
        }
        Insert: {
          analysis?: Json | null
          created_at?: string | null
          form_data: string
          id?: string
          pdf_path?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis?: Json | null
          created_at?: string | null
          form_data?: string
          id?: string
          pdf_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_report_tool: {
        Row: {
          accessibility_limitations: string[] | null
          benchmark_requested: boolean | null
          business_area: string
          churn_rate: number | null
          contact_consent: boolean | null
          country: string
          created_at: string | null
          currency: string
          customer_acquisition_rate: number | null
          customer_cac: number | null
          customer_ltv: number | null
          email: string
          id: string
          market_accessibility_percentage: number | null
          market_penetration_percentage: number | null
          market_segment: string | null
          market_validation: string | null
          name: string
          newsletter: boolean | null
          penetration_strategies: string[] | null
          potential_customers: number | null
          report_content: string | null
          revenue_per_customer: number | null
          sam: number
          sector: string
          som: number
          startup_name: string
          tam: number
          target_customer_type: string | null
          updated_at: string | null
        }
        Insert: {
          accessibility_limitations?: string[] | null
          benchmark_requested?: boolean | null
          business_area: string
          churn_rate?: number | null
          contact_consent?: boolean | null
          country: string
          created_at?: string | null
          currency: string
          customer_acquisition_rate?: number | null
          customer_cac?: number | null
          customer_ltv?: number | null
          email: string
          id?: string
          market_accessibility_percentage?: number | null
          market_penetration_percentage?: number | null
          market_segment?: string | null
          market_validation?: string | null
          name: string
          newsletter?: boolean | null
          penetration_strategies?: string[] | null
          potential_customers?: number | null
          report_content?: string | null
          revenue_per_customer?: number | null
          sam: number
          sector: string
          som: number
          startup_name: string
          tam: number
          target_customer_type?: string | null
          updated_at?: string | null
        }
        Update: {
          accessibility_limitations?: string[] | null
          benchmark_requested?: boolean | null
          business_area?: string
          churn_rate?: number | null
          contact_consent?: boolean | null
          country?: string
          created_at?: string | null
          currency?: string
          customer_acquisition_rate?: number | null
          customer_cac?: number | null
          customer_ltv?: number | null
          email?: string
          id?: string
          market_accessibility_percentage?: number | null
          market_penetration_percentage?: number | null
          market_segment?: string | null
          market_validation?: string | null
          name?: string
          newsletter?: boolean | null
          penetration_strategies?: string[] | null
          potential_customers?: number | null
          report_content?: string | null
          revenue_per_customer?: number | null
          sam?: number
          sector?: string
          som?: number
          startup_name?: string
          tam?: number
          target_customer_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      marketing_sim: {
        Row: {
          created_at: string | null
          estimated_customers: number
          estimated_roi: number
          id: string
          selected_tactics: Json | null
          student_name: string
          total_score: number
          tutor_group: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_customers: number
          estimated_roi: number
          id?: string
          selected_tactics?: Json | null
          student_name: string
          total_score: number
          tutor_group: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_customers?: number
          estimated_roi?: number
          id?: string
          selected_tactics?: Json | null
          student_name?: string
          total_score?: number
          tutor_group?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pitch_deck_submissions: {
        Row: {
          analysis: Json | null
          created_at: string | null
          deck_text: string
          email: string
          has_customers_or_loi: boolean | null
          has_revenue: boolean | null
          id: string
          interested_in_support: boolean | null
          is_eis_registered: boolean | null
          is_seis_registered: boolean | null
          seeking_funding: boolean | null
          startup_stage: string | null
          updated_at: string | null
          user_name: string
          venture_name: string
        }
        Insert: {
          analysis?: Json | null
          created_at?: string | null
          deck_text: string
          email: string
          has_customers_or_loi?: boolean | null
          has_revenue?: boolean | null
          id?: string
          interested_in_support?: boolean | null
          is_eis_registered?: boolean | null
          is_seis_registered?: boolean | null
          seeking_funding?: boolean | null
          startup_stage?: string | null
          updated_at?: string | null
          user_name: string
          venture_name: string
        }
        Update: {
          analysis?: Json | null
          created_at?: string | null
          deck_text?: string
          email?: string
          has_customers_or_loi?: boolean | null
          has_revenue?: boolean | null
          id?: string
          interested_in_support?: boolean | null
          is_eis_registered?: boolean | null
          is_seis_registered?: boolean | null
          seeking_funding?: boolean | null
          startup_stage?: string | null
          updated_at?: string | null
          user_name?: string
          venture_name?: string
        }
        Relationships: []
      }
      pitch_form_submissions: {
        Row: {
          created_at: string | null
          email: string
          has_customers_or_loi: boolean | null
          has_revenue: boolean | null
          id: string
          interested_in_support: boolean | null
          is_eis_registered: boolean | null
          is_seis_registered: boolean | null
          seeking_funding: boolean | null
          startup_stage: string | null
          updated_at: string | null
          user_name: string
          venture_name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          has_customers_or_loi?: boolean | null
          has_revenue?: boolean | null
          id?: string
          interested_in_support?: boolean | null
          is_eis_registered?: boolean | null
          is_seis_registered?: boolean | null
          seeking_funding?: boolean | null
          startup_stage?: string | null
          updated_at?: string | null
          user_name: string
          venture_name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          has_customers_or_loi?: boolean | null
          has_revenue?: boolean | null
          id?: string
          interested_in_support?: boolean | null
          is_eis_registered?: boolean | null
          is_seis_registered?: boolean | null
          seeking_funding?: boolean | null
          startup_stage?: string | null
          updated_at?: string | null
          user_name?: string
          venture_name?: string
        }
        Relationships: []
      }
      profit_calculator_submissions: {
        Row: {
          affiliate_revenue: number | null
          created_at: string | null
          delivery_tools: number | null
          freelance_costs: number | null
          gross_profit: number | null
          gross_profit_margin: number | null
          id: string
          marketing_costs: number | null
          net_profit: number | null
          net_profit_margin: number | null
          operating_expenses: number | null
          operations_tools: number | null
          project_revenue: number | null
          retainer_revenue: number | null
          selected_country: string | null
          selected_currency: string | null
          session_id: string | null
          staffing_costs: number | null
          tax_amount: number | null
          total_revenue: number | null
          training_costs: number | null
          travel_expenses: number | null
          updated_at: string | null
        }
        Insert: {
          affiliate_revenue?: number | null
          created_at?: string | null
          delivery_tools?: number | null
          freelance_costs?: number | null
          gross_profit?: number | null
          gross_profit_margin?: number | null
          id?: string
          marketing_costs?: number | null
          net_profit?: number | null
          net_profit_margin?: number | null
          operating_expenses?: number | null
          operations_tools?: number | null
          project_revenue?: number | null
          retainer_revenue?: number | null
          selected_country?: string | null
          selected_currency?: string | null
          session_id?: string | null
          staffing_costs?: number | null
          tax_amount?: number | null
          total_revenue?: number | null
          training_costs?: number | null
          travel_expenses?: number | null
          updated_at?: string | null
        }
        Update: {
          affiliate_revenue?: number | null
          created_at?: string | null
          delivery_tools?: number | null
          freelance_costs?: number | null
          gross_profit?: number | null
          gross_profit_margin?: number | null
          id?: string
          marketing_costs?: number | null
          net_profit?: number | null
          net_profit_margin?: number | null
          operating_expenses?: number | null
          operations_tools?: number | null
          project_revenue?: number | null
          retainer_revenue?: number | null
          selected_country?: string | null
          selected_currency?: string | null
          session_id?: string | null
          staffing_costs?: number | null
          tax_amount?: number | null
          total_revenue?: number | null
          training_costs?: number | null
          travel_expenses?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          created_at: string | null
          id: string
          is_custom: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
        }
        Relationships: []
      }
      ss_risk_results: {
        Row: {
          category_details: Json
          created_at: string
          executive_summary: Json
          id: string
          max_possible_score: number
          max_value_possible: number
          risk_level: string
          risk_score: number
          survey_id: string | null
          updated_at: string
          value_score: number
        }
        Insert: {
          category_details: Json
          created_at?: string
          executive_summary: Json
          id?: string
          max_possible_score: number
          max_value_possible: number
          risk_level: string
          risk_score: number
          survey_id?: string | null
          updated_at?: string
          value_score: number
        }
        Update: {
          category_details?: Json
          created_at?: string
          executive_summary?: Json
          id?: string
          max_possible_score?: number
          max_value_possible?: number
          risk_level?: string
          risk_score?: number
          survey_id?: string | null
          updated_at?: string
          value_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ss_risk_results_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "ss_risk_survey"
            referencedColumns: ["id"]
          },
        ]
      }
      ss_risk_survey: {
        Row: {
          backup_frequency: string | null
          business_name: string
          business_size: string
          category_details: Json
          cloud_provider: string | null
          created_at: string | null
          current_provider: boolean | null
          data_regulations: string | null
          email: string
          executive_summary: Json
          id: string
          industry: string
          it_issues: string | null
          last_audit: string | null
          max_possible_score: number
          max_value_possible: number
          mfa_enabled: string | null
          name: string
          newsletter: boolean | null
          provider_duration: string | null
          response_needed: string | null
          risk_level: string
          risk_score: number
          sensitive_data: string | null
          updated_at: string | null
          value_score: number
        }
        Insert: {
          backup_frequency?: string | null
          business_name: string
          business_size: string
          category_details: Json
          cloud_provider?: string | null
          created_at?: string | null
          current_provider?: boolean | null
          data_regulations?: string | null
          email: string
          executive_summary: Json
          id?: string
          industry: string
          it_issues?: string | null
          last_audit?: string | null
          max_possible_score: number
          max_value_possible: number
          mfa_enabled?: string | null
          name: string
          newsletter?: boolean | null
          provider_duration?: string | null
          response_needed?: string | null
          risk_level: string
          risk_score: number
          sensitive_data?: string | null
          updated_at?: string | null
          value_score: number
        }
        Update: {
          backup_frequency?: string | null
          business_name?: string
          business_size?: string
          category_details?: Json
          cloud_provider?: string | null
          created_at?: string | null
          current_provider?: boolean | null
          data_regulations?: string | null
          email?: string
          executive_summary?: Json
          id?: string
          industry?: string
          it_issues?: string | null
          last_audit?: string | null
          max_possible_score?: number
          max_value_possible?: number
          mfa_enabled?: string | null
          name?: string
          newsletter?: boolean | null
          provider_duration?: string | null
          response_needed?: string | null
          risk_level?: string
          risk_score?: number
          sensitive_data?: string | null
          updated_at?: string | null
          value_score?: number
        }
        Relationships: []
      }
      ss_tool_risk: {
        Row: {
          backup_frequency: string | null
          business_name: string
          business_size: string
          category_details: Json
          cloud_provider: string | null
          cloud_services: string | null
          created_at: string | null
          current_provider: boolean | null
          data_regulations: string | null
          email: string
          endpoint_protection: string | null
          executive_summary: Json
          id: string
          industry: string
          internal_it: string | null
          it_issues: string | null
          last_audit: string | null
          max_possible_score: number
          max_value_possible: number
          mfa_enabled: string | null
          name: string
          newsletter: boolean | null
          phishing_attempt: string | null
          provider_duration: string | null
          response_needed: string | null
          risk_level: string
          risk_score: number
          sensitive_data: string | null
          updated_at: string | null
          value_score: number
        }
        Insert: {
          backup_frequency?: string | null
          business_name: string
          business_size: string
          category_details: Json
          cloud_provider?: string | null
          cloud_services?: string | null
          created_at?: string | null
          current_provider?: boolean | null
          data_regulations?: string | null
          email: string
          endpoint_protection?: string | null
          executive_summary: Json
          id?: string
          industry: string
          internal_it?: string | null
          it_issues?: string | null
          last_audit?: string | null
          max_possible_score: number
          max_value_possible: number
          mfa_enabled?: string | null
          name: string
          newsletter?: boolean | null
          phishing_attempt?: string | null
          provider_duration?: string | null
          response_needed?: string | null
          risk_level: string
          risk_score: number
          sensitive_data?: string | null
          updated_at?: string | null
          value_score: number
        }
        Update: {
          backup_frequency?: string | null
          business_name?: string
          business_size?: string
          category_details?: Json
          cloud_provider?: string | null
          cloud_services?: string | null
          created_at?: string | null
          current_provider?: boolean | null
          data_regulations?: string | null
          email?: string
          endpoint_protection?: string | null
          executive_summary?: Json
          id?: string
          industry?: string
          internal_it?: string | null
          it_issues?: string | null
          last_audit?: string | null
          max_possible_score?: number
          max_value_possible?: number
          mfa_enabled?: string | null
          name?: string
          newsletter?: boolean | null
          phishing_attempt?: string | null
          provider_duration?: string | null
          response_needed?: string | null
          risk_level?: string
          risk_score?: number
          sensitive_data?: string | null
          updated_at?: string | null
          value_score?: number
        }
        Relationships: []
      }
      submission_tracking: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string
          last_submission_time: string | null
          session_id: string | null
          submission_count: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address: string
          last_submission_time?: string | null
          session_id?: string | null
          submission_count?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string
          last_submission_time?: string | null
          session_id?: string | null
          submission_count?: number | null
        }
        Relationships: []
      }
      tam_sam_som: {
        Row: {
          analysis: Json | null
          assumptions: string | null
          company_name: string
          competitors: string | null
          created_at: string | null
          email: string
          geographic_focus: string
          id: string
          industry: string
          product_description: string
          sam: number
          som: number
          tam: number
          target_customers: string
          updated_at: string | null
        }
        Insert: {
          analysis?: Json | null
          assumptions?: string | null
          company_name: string
          competitors?: string | null
          created_at?: string | null
          email: string
          geographic_focus: string
          id?: string
          industry: string
          product_description: string
          sam: number
          som: number
          tam: number
          target_customers: string
          updated_at?: string | null
        }
        Update: {
          analysis?: Json | null
          assumptions?: string | null
          company_name?: string
          competitors?: string | null
          created_at?: string | null
          email?: string
          geographic_focus?: string
          id?: string
          industry?: string
          product_description?: string
          sam?: number
          som?: number
          tam?: number
          target_customers?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
