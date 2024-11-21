/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query CompanyCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    companyCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        project_name\n        business_units {\n          id\n          name\n        }\n        type\n        total_potential\n        ex_post_to_date\n        ex_ante_to_date\n        project_completion\n        total_allocated_to_date\n        total_available_to_date\n        allocation_rate\n        price\n        total_amount\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n": types.CompanyCarbonAssetAllocationDocument,
    "\n  query ProjectCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    projectCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        business_unit {\n          id\n          name\n        }\n        allocated\n        allocation_amount\n        target\n        actual\n        start_date\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n": types.ProjectCarbonAssetAllocationDocument,
    "\n  query BusinessUnitCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    businessUnitCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        project {\n          id\n          name\n        }\n        total_cu\n        allocated\n        generated\n        forward\n        retired\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n": types.BusinessUnitCarbonAssetAllocationDocument,
    "\n  query AvailableToAllocate($project_id: String!, $business_unit_id: String!) {\n    availableToAllocate(project_id: $project_id, business_unit_id: $business_unit_id) {\n      available_percent\n      available_units\n    }\n  }\n": types.AvailableToAllocateDocument,
    "\n  query BusinessUnits {\n    businessUnits {\n      id\n      name\n      description\n      default_emission\n      default_target\n      actual_rate\n      metadata {\n        key\n        value\n      }\n      yearly_emissions\n      yearly_contributions\n      allocations {\n        project\n        amount\n      }\n    }\n  }\n": types.BusinessUnitsDocument,
    "\n  query BusinessUnitDetails($id: String!) {\n    businessUnitDetails(id: $id) {\n      id\n      name\n      description\n      default_emission\n      default_target\n      metadata {\n        key\n        value\n      }\n      allocations {\n        project\n        amount\n      }\n      yearly_emissions\n      yearly_contributions\n    }\n  }\n": types.BusinessUnitDetailsDocument,
    "\n  mutation createBusinessUnit($request: CreateBusinessUnitRequest!) {\n    createBusinessUnit(request: $request) {\n      id\n      errors\n    }\n  }\n": types.CreateBusinessUnitDocument,
    "\n  query GetImpactMetrics($view: VisualizationViewType!) {\n    getImpactMetrics(view: $view) {\n      protected_forest\n      protected_species\n      removed_tons\n      sdgs {\n        name\n        number\n      }\n    }\n  }\n": types.GetImpactMetricsDocument,
    "\n  query GetGlobalData($view: VisualizationViewType) {\n    getGlobalData(view: $view) {\n      target\n      actual\n      debt\n      number_of_projects\n      invested_amount\n    }\n  }\n": types.GetGlobalDataDocument,
    "\n  query NetZeroPlanning($view: VisualizationViewType) {\n    netZeroPlanning(view: $view) {\n      vintage\n      ex_ante_count\n      ex_post_count\n      emission\n      target\n      actual\n      retired\n    }\n  }\n": types.NetZeroPlanningDocument,
    "\n  query Annual($view: VisualizationViewType!, $pagination: Pagination) {\n    annual(view: $view, pagination: $pagination) {\n      data {\n        time_period\n        emissions\n        ex_post_issued\n        ex_post_purchased\n        ex_post_retired\n        target\n        actual_rate\n        delta\n        debt\n        ex_post_stock\n        ex_ante_stock\n        total_ex_post\n        total_ex_ante\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n": types.AnnualDocument,
    "\n  query Cumulative($view: VisualizationViewType!, $pagination: Pagination) {\n    cumulative(view: $view, pagination: $pagination) {\n      data {\n        time_period\n        emissions\n        ex_post_issued\n        ex_post_purchased\n        ex_post_retired\n        target\n        actual_rate\n        delta\n        debt\n        ex_post_stock\n        ex_ante_stock\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n": types.CumulativeDocument,
    "\n  query FinancialAnalysis($view: VisualizationViewType!, $pagination: Pagination) {\n    financialAnalysis(view: $view, pagination: $pagination) {\n      data {\n        year\n        all_time_avg_issued_price\n        all_time_avg_purchased_price\n        all_time_avg_price\n        avg_issued_price\n        avg_purchased_price\n        avg_price\n        cumulative_emission_debt\n        cumulative_total_amount\n        emission_debt\n        total_amount\n        total_issued_amount\n        total_purchased_amount\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n": types.FinancialAnalysisDocument,
    "\n  query Projects {\n    projects {\n      id\n      name\n      slug\n      metadata\n    }\n  }\n": types.ProjectsDocument,
    "\n  query ProjectBy($field: String!, $value: String!) {\n    projectBy(field: $field, value: $value) {\n      id\n      name\n      description\n      localization\n      startDate\n      endDate\n      area\n      type\n      origin\n      slug\n      certifier {\n        id\n        name\n      }\n      developper {\n        id\n        name\n      }\n      country {\n        name\n        code\n      }\n      metadata\n      global_data {\n        amount\n        source\n        rating\n        allocated_units\n        available_ex_post\n        available_ex_ante\n      }\n    }\n  }\n": types.ProjectByDocument,
    "\n  query GetProjectsMetrics($view: VisualizationViewType) {\n    getProjectMetrics(view: $view) {\n      colors {\n        blue {\n          key\n          value\n        }\n        green {\n          key\n          value\n        }\n        orange {\n          key\n          value\n        }\n        black {\n          key\n          value\n        }\n        red {\n          key\n          value\n        }\n        grey {\n          key\n          value\n        }\n      }\n      localization {\n        value\n        country {\n          flag\n          iso\n          name\n        }\n      }\n      standards {\n        key\n        value\n      }\n      types {\n        avoidance\n        removal\n      }\n    }\n  }\n": types.GetProjectsMetricsDocument,
    "\n  query GetStock($view: VisualizationViewType!, $pagination: Pagination) {\n    getStock(view: $view, pagination: $pagination) {\n      data {\n        project {\n          id\n          name\n          metadata {\n            key\n            value\n          }\n        }\n        vintage\n        quantity\n        available\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n": types.GetStockDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CompanyCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    companyCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        project_name\n        business_units {\n          id\n          name\n        }\n        type\n        total_potential\n        ex_post_to_date\n        ex_ante_to_date\n        project_completion\n        total_allocated_to_date\n        total_available_to_date\n        allocation_rate\n        price\n        total_amount\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"): (typeof documents)["\n  query CompanyCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    companyCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        project_name\n        business_units {\n          id\n          name\n        }\n        type\n        total_potential\n        ex_post_to_date\n        ex_ante_to_date\n        project_completion\n        total_allocated_to_date\n        total_available_to_date\n        allocation_rate\n        price\n        total_amount\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ProjectCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    projectCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        business_unit {\n          id\n          name\n        }\n        allocated\n        allocation_amount\n        target\n        actual\n        start_date\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProjectCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    projectCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        business_unit {\n          id\n          name\n        }\n        allocated\n        allocation_amount\n        target\n        actual\n        start_date\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BusinessUnitCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    businessUnitCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        project {\n          id\n          name\n        }\n        total_cu\n        allocated\n        generated\n        forward\n        retired\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"): (typeof documents)["\n  query BusinessUnitCarbonAssetAllocation($id: String!, $pagination: Pagination) {\n    businessUnitCarbonAssetAllocation(id: $id, pagination: $pagination) {\n      data {\n        project {\n          id\n          name\n        }\n        total_cu\n        allocated\n        generated\n        forward\n        retired\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AvailableToAllocate($project_id: String!, $business_unit_id: String!) {\n    availableToAllocate(project_id: $project_id, business_unit_id: $business_unit_id) {\n      available_percent\n      available_units\n    }\n  }\n"): (typeof documents)["\n  query AvailableToAllocate($project_id: String!, $business_unit_id: String!) {\n    availableToAllocate(project_id: $project_id, business_unit_id: $business_unit_id) {\n      available_percent\n      available_units\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BusinessUnits {\n    businessUnits {\n      id\n      name\n      description\n      default_emission\n      default_target\n      actual_rate\n      metadata {\n        key\n        value\n      }\n      yearly_emissions\n      yearly_contributions\n      allocations {\n        project\n        amount\n      }\n    }\n  }\n"): (typeof documents)["\n  query BusinessUnits {\n    businessUnits {\n      id\n      name\n      description\n      default_emission\n      default_target\n      actual_rate\n      metadata {\n        key\n        value\n      }\n      yearly_emissions\n      yearly_contributions\n      allocations {\n        project\n        amount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BusinessUnitDetails($id: String!) {\n    businessUnitDetails(id: $id) {\n      id\n      name\n      description\n      default_emission\n      default_target\n      metadata {\n        key\n        value\n      }\n      allocations {\n        project\n        amount\n      }\n      yearly_emissions\n      yearly_contributions\n    }\n  }\n"): (typeof documents)["\n  query BusinessUnitDetails($id: String!) {\n    businessUnitDetails(id: $id) {\n      id\n      name\n      description\n      default_emission\n      default_target\n      metadata {\n        key\n        value\n      }\n      allocations {\n        project\n        amount\n      }\n      yearly_emissions\n      yearly_contributions\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createBusinessUnit($request: CreateBusinessUnitRequest!) {\n    createBusinessUnit(request: $request) {\n      id\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation createBusinessUnit($request: CreateBusinessUnitRequest!) {\n    createBusinessUnit(request: $request) {\n      id\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetImpactMetrics($view: VisualizationViewType!) {\n    getImpactMetrics(view: $view) {\n      protected_forest\n      protected_species\n      removed_tons\n      sdgs {\n        name\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetImpactMetrics($view: VisualizationViewType!) {\n    getImpactMetrics(view: $view) {\n      protected_forest\n      protected_species\n      removed_tons\n      sdgs {\n        name\n        number\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetGlobalData($view: VisualizationViewType) {\n    getGlobalData(view: $view) {\n      target\n      actual\n      debt\n      number_of_projects\n      invested_amount\n    }\n  }\n"): (typeof documents)["\n  query GetGlobalData($view: VisualizationViewType) {\n    getGlobalData(view: $view) {\n      target\n      actual\n      debt\n      number_of_projects\n      invested_amount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query NetZeroPlanning($view: VisualizationViewType) {\n    netZeroPlanning(view: $view) {\n      vintage\n      ex_ante_count\n      ex_post_count\n      emission\n      target\n      actual\n      retired\n    }\n  }\n"): (typeof documents)["\n  query NetZeroPlanning($view: VisualizationViewType) {\n    netZeroPlanning(view: $view) {\n      vintage\n      ex_ante_count\n      ex_post_count\n      emission\n      target\n      actual\n      retired\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Annual($view: VisualizationViewType!, $pagination: Pagination) {\n    annual(view: $view, pagination: $pagination) {\n      data {\n        time_period\n        emissions\n        ex_post_issued\n        ex_post_purchased\n        ex_post_retired\n        target\n        actual_rate\n        delta\n        debt\n        ex_post_stock\n        ex_ante_stock\n        total_ex_post\n        total_ex_ante\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"): (typeof documents)["\n  query Annual($view: VisualizationViewType!, $pagination: Pagination) {\n    annual(view: $view, pagination: $pagination) {\n      data {\n        time_period\n        emissions\n        ex_post_issued\n        ex_post_purchased\n        ex_post_retired\n        target\n        actual_rate\n        delta\n        debt\n        ex_post_stock\n        ex_ante_stock\n        total_ex_post\n        total_ex_ante\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Cumulative($view: VisualizationViewType!, $pagination: Pagination) {\n    cumulative(view: $view, pagination: $pagination) {\n      data {\n        time_period\n        emissions\n        ex_post_issued\n        ex_post_purchased\n        ex_post_retired\n        target\n        actual_rate\n        delta\n        debt\n        ex_post_stock\n        ex_ante_stock\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"): (typeof documents)["\n  query Cumulative($view: VisualizationViewType!, $pagination: Pagination) {\n    cumulative(view: $view, pagination: $pagination) {\n      data {\n        time_period\n        emissions\n        ex_post_issued\n        ex_post_purchased\n        ex_post_retired\n        target\n        actual_rate\n        delta\n        debt\n        ex_post_stock\n        ex_ante_stock\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FinancialAnalysis($view: VisualizationViewType!, $pagination: Pagination) {\n    financialAnalysis(view: $view, pagination: $pagination) {\n      data {\n        year\n        all_time_avg_issued_price\n        all_time_avg_purchased_price\n        all_time_avg_price\n        avg_issued_price\n        avg_purchased_price\n        avg_price\n        cumulative_emission_debt\n        cumulative_total_amount\n        emission_debt\n        total_amount\n        total_issued_amount\n        total_purchased_amount\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"): (typeof documents)["\n  query FinancialAnalysis($view: VisualizationViewType!, $pagination: Pagination) {\n    financialAnalysis(view: $view, pagination: $pagination) {\n      data {\n        year\n        all_time_avg_issued_price\n        all_time_avg_purchased_price\n        all_time_avg_price\n        avg_issued_price\n        avg_purchased_price\n        avg_price\n        cumulative_emission_debt\n        cumulative_total_amount\n        emission_debt\n        total_amount\n        total_issued_amount\n        total_purchased_amount\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Projects {\n    projects {\n      id\n      name\n      slug\n      metadata\n    }\n  }\n"): (typeof documents)["\n  query Projects {\n    projects {\n      id\n      name\n      slug\n      metadata\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ProjectBy($field: String!, $value: String!) {\n    projectBy(field: $field, value: $value) {\n      id\n      name\n      description\n      localization\n      startDate\n      endDate\n      area\n      type\n      origin\n      slug\n      certifier {\n        id\n        name\n      }\n      developper {\n        id\n        name\n      }\n      country {\n        name\n        code\n      }\n      metadata\n      global_data {\n        amount\n        source\n        rating\n        allocated_units\n        available_ex_post\n        available_ex_ante\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProjectBy($field: String!, $value: String!) {\n    projectBy(field: $field, value: $value) {\n      id\n      name\n      description\n      localization\n      startDate\n      endDate\n      area\n      type\n      origin\n      slug\n      certifier {\n        id\n        name\n      }\n      developper {\n        id\n        name\n      }\n      country {\n        name\n        code\n      }\n      metadata\n      global_data {\n        amount\n        source\n        rating\n        allocated_units\n        available_ex_post\n        available_ex_ante\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectsMetrics($view: VisualizationViewType) {\n    getProjectMetrics(view: $view) {\n      colors {\n        blue {\n          key\n          value\n        }\n        green {\n          key\n          value\n        }\n        orange {\n          key\n          value\n        }\n        black {\n          key\n          value\n        }\n        red {\n          key\n          value\n        }\n        grey {\n          key\n          value\n        }\n      }\n      localization {\n        value\n        country {\n          flag\n          iso\n          name\n        }\n      }\n      standards {\n        key\n        value\n      }\n      types {\n        avoidance\n        removal\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProjectsMetrics($view: VisualizationViewType) {\n    getProjectMetrics(view: $view) {\n      colors {\n        blue {\n          key\n          value\n        }\n        green {\n          key\n          value\n        }\n        orange {\n          key\n          value\n        }\n        black {\n          key\n          value\n        }\n        red {\n          key\n          value\n        }\n        grey {\n          key\n          value\n        }\n      }\n      localization {\n        value\n        country {\n          flag\n          iso\n          name\n        }\n      }\n      standards {\n        key\n        value\n      }\n      types {\n        avoidance\n        removal\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetStock($view: VisualizationViewType!, $pagination: Pagination) {\n    getStock(view: $view, pagination: $pagination) {\n      data {\n        project {\n          id\n          name\n          metadata {\n            key\n            value\n          }\n        }\n        vintage\n        quantity\n        available\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetStock($view: VisualizationViewType!, $pagination: Pagination) {\n    getStock(view: $view, pagination: $pagination) {\n      data {\n        project {\n          id\n          name\n          metadata {\n            key\n            value\n          }\n        }\n        vintage\n        quantity\n        available\n      }\n      page_info {\n        has_next_page\n        has_previous_page\n        total_page\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;