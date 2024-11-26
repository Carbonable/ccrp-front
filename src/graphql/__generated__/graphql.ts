/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AddAllocationRequestItem = {
  allow_over_allocation?: InputMaybe<Scalars['Boolean']['input']>;
  allow_vintage_homogeneisation?: InputMaybe<Scalars['Boolean']['input']>;
  amount: Scalars['Int']['input'];
  business_unit_id: Scalars['String']['input'];
  project_id?: InputMaybe<Scalars['String']['input']>;
};

export type AddAllocationResponse = {
  __typename?: 'AddAllocationResponse';
  allocationIds: Array<Maybe<Scalars['String']['output']>>;
  errors: Array<Maybe<Scalars['String']['output']>>;
};

export type Allocation = {
  __typename?: 'Allocation';
  amount?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
};

export type AllocationAvailability = {
  __typename?: 'AllocationAvailability';
  available_percent?: Maybe<Scalars['Float']['output']>;
  available_units?: Maybe<Scalars['Int']['output']>;
};

export type Annual = {
  __typename?: 'Annual';
  data?: Maybe<Array<Maybe<AnnualData>>>;
  page_info?: Maybe<PageInfo>;
};

export type AnnualData = {
  __typename?: 'AnnualData';
  actual_rate?: Maybe<Scalars['Float']['output']>;
  debt?: Maybe<Scalars['Float']['output']>;
  delta?: Maybe<Scalars['Float']['output']>;
  emissions?: Maybe<Scalars['Float']['output']>;
  ex_ante_stock?: Maybe<Scalars['Int']['output']>;
  ex_post_issued?: Maybe<Scalars['Int']['output']>;
  ex_post_purchased?: Maybe<Scalars['Int']['output']>;
  ex_post_retired?: Maybe<Scalars['Int']['output']>;
  ex_post_stock?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
  time_period?: Maybe<Scalars['String']['output']>;
  total_ex_ante?: Maybe<Scalars['Int']['output']>;
  total_ex_post?: Maybe<Scalars['Int']['output']>;
};

export type AssetAllocationItem = {
  __typename?: 'AssetAllocationItem';
  id: Scalars['String']['output'];
  metadata: Array<Maybe<Map>>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type BusinessUnit = {
  __typename?: 'BusinessUnit';
  actual_rate?: Maybe<Scalars['String']['output']>;
  allocations?: Maybe<Array<Maybe<Allocation>>>;
  default_emission?: Maybe<Scalars['String']['output']>;
  default_target?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Array<Maybe<Metadata>>>;
  name?: Maybe<Scalars['String']['output']>;
  yearly_contributions?: Maybe<Scalars['String']['output']>;
  yearly_emissions?: Maybe<Scalars['String']['output']>;
};

export type BusinessUnitCarbonAssetAllocation = {
  __typename?: 'BusinessUnitCarbonAssetAllocation';
  data: Array<Maybe<BusinessUnitCarbonAssetAllocationData>>;
  page_info?: Maybe<PageInfo>;
};

export type BusinessUnitCarbonAssetAllocationData = {
  __typename?: 'BusinessUnitCarbonAssetAllocationData';
  allocated?: Maybe<Scalars['Int']['output']>;
  forward?: Maybe<Scalars['Int']['output']>;
  generated?: Maybe<Scalars['Int']['output']>;
  project: AssetAllocationItem;
  retired?: Maybe<Scalars['Int']['output']>;
  total_cu?: Maybe<Scalars['Int']['output']>;
};

export type CarbonCredit = {
  __typename?: 'CarbonCredit';
  id: Scalars['ID']['output'];
  isLocked: Scalars['Boolean']['output'];
  isRetired: Scalars['Boolean']['output'];
  number?: Maybe<Scalars['String']['output']>;
  origin: CarbonCreditOrigin;
  project?: Maybe<Project>;
  type: CarbonCreditType;
  vintage?: Maybe<Scalars['Int']['output']>;
};

export enum CarbonCreditOrigin {
  DirectPurchase = 'DIRECT_PURCHASE',
  ForwardFinance = 'FORWARD_FINANCE'
}

export enum CarbonCreditType {
  Biochar = 'BIOCHAR',
  Concervation = 'CONCERVATION',
  Dac = 'DAC',
  Reforestation = 'REFORESTATION',
  Restoration = 'RESTORATION',
  SolarPanel = 'SOLAR_PANEL'
}

export type Certifier = {
  __typename?: 'Certifier';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  slug: Scalars['String']['output'];
};

export type CompanyCarbonAssetAllocation = {
  __typename?: 'CompanyCarbonAssetAllocation';
  data: Array<Maybe<CompanyCarbonAssetAllocationData>>;
  page_info?: Maybe<PageInfo>;
};

export type CompanyCarbonAssetAllocationData = {
  __typename?: 'CompanyCarbonAssetAllocationData';
  allocation_rate?: Maybe<Scalars['String']['output']>;
  business_units?: Maybe<Array<Maybe<AssetAllocationItem>>>;
  ex_ante_to_date?: Maybe<Scalars['Int']['output']>;
  ex_post_to_date?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  project_completion?: Maybe<Scalars['String']['output']>;
  project_name?: Maybe<Scalars['String']['output']>;
  project_slug?: Maybe<Scalars['String']['output']>;
  total_allocated_to_date?: Maybe<Scalars['Int']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
  total_available_to_date?: Maybe<Scalars['Int']['output']>;
  total_potential?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Country = {
  __typename?: 'Country';
  code: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateBusinessUnitRequest = {
  company_id: Scalars['String']['input'];
  default_demanded_emission?: InputMaybe<Scalars['Int']['input']>;
  default_target?: InputMaybe<Scalars['Int']['input']>;
  description: Scalars['String']['input'];
  metadata: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateBusinessUnitResponse = {
  __typename?: 'CreateBusinessUnitResponse';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['String']['output'];
};

export type CreateDemandRequest = {
  business_unit_id: Scalars['String']['input'];
  data: Array<ForecastedData>;
};

export type CreateForecastedTargetsRequest = {
  business_unit_id: Scalars['String']['input'];
  data: Array<ForecastedData>;
};

export type Cumulative = {
  __typename?: 'Cumulative';
  data?: Maybe<Array<Maybe<CumulativeData>>>;
  page_info?: Maybe<PageInfo>;
};

export type CumulativeData = {
  __typename?: 'CumulativeData';
  actual_rate?: Maybe<Scalars['Float']['output']>;
  debt?: Maybe<Scalars['Float']['output']>;
  delta?: Maybe<Scalars['Float']['output']>;
  emissions?: Maybe<Scalars['Float']['output']>;
  ex_ante_stock?: Maybe<Scalars['Int']['output']>;
  ex_post_issued?: Maybe<Scalars['Int']['output']>;
  ex_post_purchased?: Maybe<Scalars['Int']['output']>;
  ex_post_retired?: Maybe<Scalars['Int']['output']>;
  ex_post_stock?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
  time_period?: Maybe<Scalars['String']['output']>;
};

export type Developper = {
  __typename?: 'Developper';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  slug: Scalars['String']['output'];
};

export type DomainResponse = {
  __typename?: 'DomainResponse';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['String']['output'];
};

export type FinancialAnalysis = {
  __typename?: 'FinancialAnalysis';
  data?: Maybe<Array<Maybe<FinancialAnalysisData>>>;
  page_info?: Maybe<PageInfo>;
};

export type FinancialAnalysisData = {
  __typename?: 'FinancialAnalysisData';
  all_time_avg_issued_price?: Maybe<Scalars['Float']['output']>;
  all_time_avg_price?: Maybe<Scalars['Float']['output']>;
  all_time_avg_purchased_price?: Maybe<Scalars['Float']['output']>;
  avg_issued_price?: Maybe<Scalars['Float']['output']>;
  avg_price?: Maybe<Scalars['Float']['output']>;
  avg_purchased_price?: Maybe<Scalars['Float']['output']>;
  cumulative_emission_debt?: Maybe<Scalars['Float']['output']>;
  cumulative_total_amount?: Maybe<Scalars['Float']['output']>;
  emission_debt?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
  total_issued_amount?: Maybe<Scalars['Float']['output']>;
  total_purchased_amount?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type ForecastedData = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type GlobalData = {
  __typename?: 'GlobalData';
  actual: Scalars['String']['output'];
  debt: Scalars['String']['output'];
  invested_amount: Scalars['String']['output'];
  number_of_projects: Scalars['String']['output'];
  target: Scalars['String']['output'];
};

export type ImpactMetrics = {
  __typename?: 'ImpactMetrics';
  protected_forest: Scalars['String']['output'];
  protected_species: Scalars['String']['output'];
  removed_tons: Scalars['String']['output'];
  sdgs: Array<Sdg>;
};

export type LocalizationRepartition = {
  __typename?: 'LocalizationRepartition';
  country: ShortCountry;
  value: Scalars['String']['output'];
};

export type Map = {
  __typename?: 'Map';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Metadata = {
  __typename?: 'Metadata';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAllocations?: Maybe<AddAllocationResponse>;
  createBusinessUnit?: Maybe<DomainResponse>;
  createDemand?: Maybe<DomainResponse>;
  createForecastedTargets?: Maybe<DomainResponse>;
};


export type MutationAddAllocationsArgs = {
  request: Array<InputMaybe<AddAllocationRequestItem>>;
};


export type MutationCreateBusinessUnitArgs = {
  request: CreateBusinessUnitRequest;
};


export type MutationCreateDemandArgs = {
  request: CreateDemandRequest;
};


export type MutationCreateForecastedTargetsArgs = {
  request: CreateForecastedTargetsRequest;
};

export type NetZeroPlanning = {
  __typename?: 'NetZeroPlanning';
  actual?: Maybe<Scalars['Float']['output']>;
  consumed?: Maybe<Scalars['Int']['output']>;
  emission?: Maybe<Scalars['Float']['output']>;
  ex_ante_count?: Maybe<Scalars['Int']['output']>;
  ex_post_count?: Maybe<Scalars['Int']['output']>;
  retired?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
  vintage?: Maybe<Scalars['Int']['output']>;
};

export enum OffsetType {
  ExAnte = 'EX_ANTE',
  ExPost = 'EX_POST'
}

export type Order = {
  __typename?: 'Order';
  data: Array<Maybe<OrderData>>;
  page_info?: Maybe<PageInfo>;
};

export type OrderData = {
  __typename?: 'OrderData';
  created_at: Scalars['String']['output'];
  deficit: Scalars['Int']['output'];
  order_for_year: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  vintage: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  has_next_page: Scalars['Boolean']['output'];
  has_previous_page: Scalars['Boolean']['output'];
  total_page: Scalars['Int']['output'];
};

export type Pagination = {
  count: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type PaginationObject = {
  __typename?: 'PaginationObject';
  has_next_page?: Maybe<Scalars['Boolean']['output']>;
  has_previous_page?: Maybe<Scalars['Boolean']['output']>;
  next_cursor?: Maybe<Scalars['String']['output']>;
  total_page?: Maybe<Scalars['Int']['output']>;
};

export type Project = {
  __typename?: 'Project';
  area?: Maybe<Scalars['Int']['output']>;
  certifier: Certifier;
  country?: Maybe<Country>;
  description?: Maybe<Scalars['String']['output']>;
  developper?: Maybe<Developper>;
  endDate?: Maybe<Scalars['String']['output']>;
  global_data?: Maybe<ProjectGlobalData>;
  id: Scalars['ID']['output'];
  localization?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  origin?: Maybe<CarbonCreditOrigin>;
  slug?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  type?: Maybe<CarbonCreditType>;
  vintages?: Maybe<Array<Vintage>>;
};

export type ProjectCarbonAssetAllocation = {
  __typename?: 'ProjectCarbonAssetAllocation';
  data: Array<Maybe<ProjectCarbonAssetAllocationData>>;
  page_info?: Maybe<PageInfo>;
};

export type ProjectCarbonAssetAllocationData = {
  __typename?: 'ProjectCarbonAssetAllocationData';
  actual?: Maybe<Scalars['Int']['output']>;
  allocated?: Maybe<Scalars['Int']['output']>;
  allocation_amount?: Maybe<Scalars['Int']['output']>;
  business_unit: AssetAllocationItem;
  start_date?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
};

export type ProjectColorRepartition = {
  __typename?: 'ProjectColorRepartition';
  blue: Map;
  brown: Map;
  green: Map;
  grey: Map;
  na: Map;
  red: Map;
  yellow: Map;
};

export type ProjectFundingAllocation = {
  __typename?: 'ProjectFundingAllocation';
  allocation: Scalars['String']['output'];
  color: Scalars['String']['output'];
  comitted_cc: Scalars['String']['output'];
  forwarded_cc: Scalars['String']['output'];
  generated_cc: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  retired_cc: Scalars['String']['output'];
};

export type ProjectGlobalData = {
  __typename?: 'ProjectGlobalData';
  allocated_units?: Maybe<Scalars['Int']['output']>;
  amount?: Maybe<Scalars['Int']['output']>;
  available_ex_ante?: Maybe<Scalars['Int']['output']>;
  available_ex_post?: Maybe<Scalars['Int']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

export type ProjectMetrics = {
  __typename?: 'ProjectMetrics';
  colors: ProjectColorRepartition;
  localization: Array<LocalizationRepartition>;
  standards: Array<Map>;
  types: ProjectTypeRepartition;
};

export enum ProjectType {
  Arr = 'ARR',
  ReddPlus = 'REDD_PLUS'
}

export type ProjectTypeRepartition = {
  __typename?: 'ProjectTypeRepartition';
  avoidance: Scalars['String']['output'];
  removal: Scalars['String']['output'];
};

export type ProjectedDecarbonation = {
  __typename?: 'ProjectedDecarbonation';
  delta?: Maybe<Scalars['String']['output']>;
  emissions: Scalars['String']['output'];
  forward_cc: Scalars['String']['output'];
  purchased_cc: Scalars['String']['output'];
  received_cc: Scalars['String']['output'];
  retired_cc: Scalars['String']['output'];
  target: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type ProjectedDecarbonationGraph = {
  __typename?: 'ProjectedDecarbonationGraph';
  data: Array<Maybe<StrIntMap>>;
  emissions: Scalars['Float']['output'];
  target: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export enum ProjectedDecarbonationViewType {
  InvestmentType = 'INVESTMENT_TYPE',
  OffsetType = 'OFFSET_TYPE',
  ProjectType = 'PROJECT_TYPE'
}

export type ProjectedDecarbonationWithPagination = {
  __typename?: 'ProjectedDecarbonationWithPagination';
  data: Array<ProjectedDecarbonation>;
  pagination?: Maybe<PaginationObject>;
};

export type ProjectedFundingAllocationWithPagination = {
  __typename?: 'ProjectedFundingAllocationWithPagination';
  data: Array<ProjectFundingAllocation>;
  pagination?: Maybe<PaginationObject>;
};

export type Query = {
  __typename?: 'Query';
  annual: Annual;
  availableToAllocate?: Maybe<AllocationAvailability>;
  businessUnitCarbonAssetAllocation?: Maybe<BusinessUnitCarbonAssetAllocation>;
  businessUnitDetails?: Maybe<BusinessUnit>;
  businessUnits?: Maybe<Array<Maybe<BusinessUnit>>>;
  businessUnitsBy?: Maybe<Array<Maybe<BusinessUnit>>>;
  certifierBy?: Maybe<Certifier>;
  companyCarbonAssetAllocation?: Maybe<CompanyCarbonAssetAllocation>;
  countries?: Maybe<Array<Maybe<Country>>>;
  countryBy?: Maybe<Country>;
  cumulative: Cumulative;
  financialAnalysis: FinancialAnalysis;
  getGlobalData?: Maybe<GlobalData>;
  getImpactMetrics: ImpactMetrics;
  getOrder?: Maybe<Order>;
  getProjectFundingAllocation?: Maybe<ProjectedFundingAllocationWithPagination>;
  getProjectMetrics: ProjectMetrics;
  getStock?: Maybe<Stock>;
  netZeroPlanning: Array<Maybe<NetZeroPlanning>>;
  projectBy?: Maybe<Project>;
  projectCarbonAssetAllocation?: Maybe<ProjectCarbonAssetAllocation>;
  projects?: Maybe<Array<Maybe<Project>>>;
};


export type QueryAnnualArgs = {
  pagination?: InputMaybe<Pagination>;
  view: VisualizationViewType;
};


export type QueryAvailableToAllocateArgs = {
  business_unit_id: Scalars['String']['input'];
  project_id: Scalars['String']['input'];
};


export type QueryBusinessUnitCarbonAssetAllocationArgs = {
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};


export type QueryBusinessUnitDetailsArgs = {
  id: Scalars['String']['input'];
};


export type QueryBusinessUnitsByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type QueryCertifierByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type QueryCompanyCarbonAssetAllocationArgs = {
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};


export type QueryCountryByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type QueryCumulativeArgs = {
  pagination?: InputMaybe<Pagination>;
  view: VisualizationViewType;
};


export type QueryFinancialAnalysisArgs = {
  pagination?: InputMaybe<Pagination>;
  view: VisualizationViewType;
};


export type QueryGetGlobalDataArgs = {
  view?: InputMaybe<VisualizationViewType>;
};


export type QueryGetImpactMetricsArgs = {
  view?: InputMaybe<VisualizationViewType>;
};


export type QueryGetOrderArgs = {
  pagination?: InputMaybe<Pagination>;
  view?: InputMaybe<VisualizationViewType>;
};


export type QueryGetProjectFundingAllocationArgs = {
  view?: InputMaybe<VisualizationViewType>;
};


export type QueryGetProjectMetricsArgs = {
  view?: InputMaybe<VisualizationViewType>;
};


export type QueryGetStockArgs = {
  pagination?: InputMaybe<Pagination>;
  view?: InputMaybe<VisualizationViewType>;
};


export type QueryNetZeroPlanningArgs = {
  view?: InputMaybe<VisualizationViewType>;
};


export type QueryProjectByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type QueryProjectCarbonAssetAllocationArgs = {
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};

export type Sdg = {
  __typename?: 'Sdg';
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
};

export type ShortCountry = {
  __typename?: 'ShortCountry';
  flag: Scalars['String']['output'];
  iso: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Stock = {
  __typename?: 'Stock';
  data: Array<Maybe<StockData>>;
  page_info?: Maybe<PageInfo>;
};

export type StockData = {
  __typename?: 'StockData';
  available: Scalars['Int']['output'];
  project: AssetAllocationItem;
  quantity: Scalars['Int']['output'];
  vintage: Scalars['Int']['output'];
};

export type StrIntMap = {
  __typename?: 'StrIntMap';
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type Vintage = {
  __typename?: 'Vintage';
  capacity?: Maybe<Scalars['Int']['output']>;
  consumed?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  issued_price?: Maybe<Scalars['Float']['output']>;
  purchased?: Maybe<Scalars['Int']['output']>;
  purchased_price?: Maybe<Scalars['Int']['output']>;
  reserved?: Maybe<Scalars['Int']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type VisualizationViewType = {
  business_unit_id?: InputMaybe<Scalars['String']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
};

export type CompanyCarbonAssetAllocationQueryVariables = Exact<{
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
}>;


export type CompanyCarbonAssetAllocationQuery = { __typename?: 'Query', companyCarbonAssetAllocation?: { __typename?: 'CompanyCarbonAssetAllocation', data: Array<{ __typename?: 'CompanyCarbonAssetAllocationData', project_name?: string | null, type?: string | null, total_potential?: number | null, ex_post_to_date?: number | null, ex_ante_to_date?: number | null, project_completion?: string | null, total_allocated_to_date?: number | null, total_available_to_date?: number | null, allocation_rate?: string | null, price?: number | null, total_amount?: number | null, business_units?: Array<{ __typename?: 'AssetAllocationItem', id: string, name: string } | null> | null } | null>, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } | null };

export type ProjectCarbonAssetAllocationQueryVariables = Exact<{
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
}>;


export type ProjectCarbonAssetAllocationQuery = { __typename?: 'Query', projectCarbonAssetAllocation?: { __typename?: 'ProjectCarbonAssetAllocation', data: Array<{ __typename?: 'ProjectCarbonAssetAllocationData', allocated?: number | null, allocation_amount?: number | null, target?: number | null, actual?: number | null, start_date?: string | null, business_unit: { __typename?: 'AssetAllocationItem', id: string, name: string } } | null>, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } | null };

export type BusinessUnitCarbonAssetAllocationQueryVariables = Exact<{
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
}>;


export type BusinessUnitCarbonAssetAllocationQuery = { __typename?: 'Query', businessUnitCarbonAssetAllocation?: { __typename?: 'BusinessUnitCarbonAssetAllocation', data: Array<{ __typename?: 'BusinessUnitCarbonAssetAllocationData', total_cu?: number | null, allocated?: number | null, generated?: number | null, forward?: number | null, retired?: number | null, project: { __typename?: 'AssetAllocationItem', id: string, name: string } } | null>, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } | null };

export type AvailableToAllocateQueryVariables = Exact<{
  project_id: Scalars['String']['input'];
  business_unit_id: Scalars['String']['input'];
}>;


export type AvailableToAllocateQuery = { __typename?: 'Query', availableToAllocate?: { __typename?: 'AllocationAvailability', available_percent?: number | null, available_units?: number | null } | null };

export type BusinessUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type BusinessUnitsQuery = { __typename?: 'Query', businessUnits?: Array<{ __typename?: 'BusinessUnit', id?: string | null, name?: string | null, description?: string | null, default_emission?: string | null, default_target?: number | null, actual_rate?: string | null, yearly_emissions?: string | null, yearly_contributions?: string | null, metadata?: Array<{ __typename?: 'Metadata', key?: string | null, value?: string | null } | null> | null, allocations?: Array<{ __typename?: 'Allocation', project?: string | null, amount?: number | null } | null> | null } | null> | null };

export type BusinessUnitDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type BusinessUnitDetailsQuery = { __typename?: 'Query', businessUnitDetails?: { __typename?: 'BusinessUnit', id?: string | null, name?: string | null, description?: string | null, default_emission?: string | null, default_target?: number | null, yearly_emissions?: string | null, yearly_contributions?: string | null, metadata?: Array<{ __typename?: 'Metadata', key?: string | null, value?: string | null } | null> | null, allocations?: Array<{ __typename?: 'Allocation', project?: string | null, amount?: number | null } | null> | null } | null };

export type CreateBusinessUnitMutationVariables = Exact<{
  request: CreateBusinessUnitRequest;
}>;


export type CreateBusinessUnitMutation = { __typename?: 'Mutation', createBusinessUnit?: { __typename?: 'DomainResponse', id: string, errors?: Array<string | null> | null } | null };

export type GetImpactMetricsQueryVariables = Exact<{
  view: VisualizationViewType;
}>;


export type GetImpactMetricsQuery = { __typename?: 'Query', getImpactMetrics: { __typename?: 'ImpactMetrics', protected_forest: string, protected_species: string, removed_tons: string, sdgs: Array<{ __typename?: 'Sdg', name: string, number: number }> } };

export type GetGlobalDataQueryVariables = Exact<{
  view?: InputMaybe<VisualizationViewType>;
}>;


export type GetGlobalDataQuery = { __typename?: 'Query', getGlobalData?: { __typename?: 'GlobalData', target: string, actual: string, debt: string, number_of_projects: string, invested_amount: string } | null };

export type NetZeroPlanningQueryVariables = Exact<{
  view?: InputMaybe<VisualizationViewType>;
}>;


export type NetZeroPlanningQuery = { __typename?: 'Query', netZeroPlanning: Array<{ __typename?: 'NetZeroPlanning', vintage?: number | null, ex_ante_count?: number | null, ex_post_count?: number | null, emission?: number | null, target?: number | null, actual?: number | null, retired?: number | null } | null> };

export type AnnualQueryVariables = Exact<{
  view: VisualizationViewType;
  pagination?: InputMaybe<Pagination>;
}>;


export type AnnualQuery = { __typename?: 'Query', annual: { __typename?: 'Annual', data?: Array<{ __typename?: 'AnnualData', time_period?: string | null, emissions?: number | null, ex_post_issued?: number | null, ex_post_purchased?: number | null, ex_post_retired?: number | null, target?: number | null, actual_rate?: number | null, delta?: number | null, debt?: number | null, ex_post_stock?: number | null, ex_ante_stock?: number | null, total_ex_post?: number | null, total_ex_ante?: number | null } | null> | null, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } };

export type CumulativeQueryVariables = Exact<{
  view: VisualizationViewType;
  pagination?: InputMaybe<Pagination>;
}>;


export type CumulativeQuery = { __typename?: 'Query', cumulative: { __typename?: 'Cumulative', data?: Array<{ __typename?: 'CumulativeData', time_period?: string | null, emissions?: number | null, ex_post_issued?: number | null, ex_post_purchased?: number | null, ex_post_retired?: number | null, target?: number | null, actual_rate?: number | null, delta?: number | null, debt?: number | null, ex_post_stock?: number | null, ex_ante_stock?: number | null } | null> | null, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } };

export type FinancialAnalysisQueryVariables = Exact<{
  view: VisualizationViewType;
  pagination?: InputMaybe<Pagination>;
}>;


export type FinancialAnalysisQuery = { __typename?: 'Query', financialAnalysis: { __typename?: 'FinancialAnalysis', data?: Array<{ __typename?: 'FinancialAnalysisData', year?: number | null, all_time_avg_issued_price?: number | null, all_time_avg_purchased_price?: number | null, all_time_avg_price?: number | null, avg_issued_price?: number | null, avg_purchased_price?: number | null, avg_price?: number | null, cumulative_emission_debt?: number | null, cumulative_total_amount?: number | null, emission_debt?: number | null, total_amount?: number | null, total_issued_amount?: number | null, total_purchased_amount?: number | null } | null> | null, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } };

export type GetOrderQueryVariables = Exact<{
  view: VisualizationViewType;
  pagination?: InputMaybe<Pagination>;
}>;


export type GetOrderQuery = { __typename?: 'Query', getOrder?: { __typename?: 'Order', data: Array<{ __typename?: 'OrderData', created_at: string, order_for_year: number, vintage: number, quantity: number, deficit: number, status: string } | null>, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } | null };

export type ProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectsQuery = { __typename?: 'Query', projects?: Array<{ __typename?: 'Project', id: string, name?: string | null, slug?: string | null, metadata?: any | null } | null> | null };

export type ProjectByQueryVariables = Exact<{
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;


export type ProjectByQuery = { __typename?: 'Query', projectBy?: { __typename?: 'Project', id: string, name?: string | null, description?: string | null, localization?: string | null, startDate?: string | null, endDate?: string | null, area?: number | null, type?: CarbonCreditType | null, origin?: CarbonCreditOrigin | null, slug?: string | null, metadata?: any | null, certifier: { __typename?: 'Certifier', id: string, name: string }, developper?: { __typename?: 'Developper', id: string, name: string } | null, country?: { __typename?: 'Country', name: string, code: string } | null, global_data?: { __typename?: 'ProjectGlobalData', amount?: number | null, source?: string | null, rating?: string | null, allocated_units?: number | null, available_ex_post?: number | null, available_ex_ante?: number | null } | null } | null };

export type GetProjectsMetricsQueryVariables = Exact<{
  view?: InputMaybe<VisualizationViewType>;
}>;


export type GetProjectsMetricsQuery = { __typename?: 'Query', getProjectMetrics: { __typename?: 'ProjectMetrics', colors: { __typename?: 'ProjectColorRepartition', blue: { __typename?: 'Map', key: string, value: string }, green: { __typename?: 'Map', key: string, value: string }, brown: { __typename?: 'Map', key: string, value: string }, grey: { __typename?: 'Map', key: string, value: string }, red: { __typename?: 'Map', key: string, value: string }, yellow: { __typename?: 'Map', key: string, value: string } }, localization: Array<{ __typename?: 'LocalizationRepartition', value: string, country: { __typename?: 'ShortCountry', flag: string, iso: string, name: string } }>, standards: Array<{ __typename?: 'Map', key: string, value: string }>, types: { __typename?: 'ProjectTypeRepartition', avoidance: string, removal: string } } };

export type GetStockQueryVariables = Exact<{
  view: VisualizationViewType;
  pagination?: InputMaybe<Pagination>;
}>;


export type GetStockQuery = { __typename?: 'Query', getStock?: { __typename?: 'Stock', data: Array<{ __typename?: 'StockData', vintage: number, quantity: number, available: number, project: { __typename?: 'AssetAllocationItem', id: string, name: string, metadata: Array<{ __typename?: 'Map', key: string, value: string } | null> } } | null>, page_info?: { __typename?: 'PageInfo', has_next_page: boolean, has_previous_page: boolean, total_page: number } | null } | null };


export const CompanyCarbonAssetAllocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CompanyCarbonAssetAllocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyCarbonAssetAllocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project_name"}},{"kind":"Field","name":{"kind":"Name","value":"business_units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"total_potential"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_to_date"}},{"kind":"Field","name":{"kind":"Name","value":"ex_ante_to_date"}},{"kind":"Field","name":{"kind":"Name","value":"project_completion"}},{"kind":"Field","name":{"kind":"Name","value":"total_allocated_to_date"}},{"kind":"Field","name":{"kind":"Name","value":"total_available_to_date"}},{"kind":"Field","name":{"kind":"Name","value":"allocation_rate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"total_amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<CompanyCarbonAssetAllocationQuery, CompanyCarbonAssetAllocationQueryVariables>;
export const ProjectCarbonAssetAllocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectCarbonAssetAllocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectCarbonAssetAllocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"business_unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allocated"}},{"kind":"Field","name":{"kind":"Name","value":"allocation_amount"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"actual"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectCarbonAssetAllocationQuery, ProjectCarbonAssetAllocationQueryVariables>;
export const BusinessUnitCarbonAssetAllocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BusinessUnitCarbonAssetAllocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessUnitCarbonAssetAllocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total_cu"}},{"kind":"Field","name":{"kind":"Name","value":"allocated"}},{"kind":"Field","name":{"kind":"Name","value":"generated"}},{"kind":"Field","name":{"kind":"Name","value":"forward"}},{"kind":"Field","name":{"kind":"Name","value":"retired"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<BusinessUnitCarbonAssetAllocationQuery, BusinessUnitCarbonAssetAllocationQueryVariables>;
export const AvailableToAllocateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AvailableToAllocate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"project_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"business_unit_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableToAllocate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"project_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"project_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"business_unit_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"business_unit_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available_percent"}},{"kind":"Field","name":{"kind":"Name","value":"available_units"}}]}}]}}]} as unknown as DocumentNode<AvailableToAllocateQuery, AvailableToAllocateQueryVariables>;
export const BusinessUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BusinessUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"default_emission"}},{"kind":"Field","name":{"kind":"Name","value":"default_target"}},{"kind":"Field","name":{"kind":"Name","value":"actual_rate"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearly_emissions"}},{"kind":"Field","name":{"kind":"Name","value":"yearly_contributions"}},{"kind":"Field","name":{"kind":"Name","value":"allocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]} as unknown as DocumentNode<BusinessUnitsQuery, BusinessUnitsQueryVariables>;
export const BusinessUnitDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BusinessUnitDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessUnitDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"default_emission"}},{"kind":"Field","name":{"kind":"Name","value":"default_target"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearly_emissions"}},{"kind":"Field","name":{"kind":"Name","value":"yearly_contributions"}}]}}]}}]} as unknown as DocumentNode<BusinessUnitDetailsQuery, BusinessUnitDetailsQueryVariables>;
export const CreateBusinessUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBusinessUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBusinessUnitRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBusinessUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<CreateBusinessUnitMutation, CreateBusinessUnitMutationVariables>;
export const GetImpactMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImpactMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getImpactMetrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"protected_forest"}},{"kind":"Field","name":{"kind":"Name","value":"protected_species"}},{"kind":"Field","name":{"kind":"Name","value":"removed_tons"}},{"kind":"Field","name":{"kind":"Name","value":"sdgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<GetImpactMetricsQuery, GetImpactMetricsQueryVariables>;
export const GetGlobalDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGlobalData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGlobalData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"actual"}},{"kind":"Field","name":{"kind":"Name","value":"debt"}},{"kind":"Field","name":{"kind":"Name","value":"number_of_projects"}},{"kind":"Field","name":{"kind":"Name","value":"invested_amount"}}]}}]}}]} as unknown as DocumentNode<GetGlobalDataQuery, GetGlobalDataQueryVariables>;
export const NetZeroPlanningDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NetZeroPlanning"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"netZeroPlanning"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"ex_ante_count"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_count"}},{"kind":"Field","name":{"kind":"Name","value":"emission"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"actual"}},{"kind":"Field","name":{"kind":"Name","value":"retired"}}]}}]}}]} as unknown as DocumentNode<NetZeroPlanningQuery, NetZeroPlanningQueryVariables>;
export const AnnualDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Annual"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annual"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time_period"}},{"kind":"Field","name":{"kind":"Name","value":"emissions"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_issued"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_purchased"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_retired"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"actual_rate"}},{"kind":"Field","name":{"kind":"Name","value":"delta"}},{"kind":"Field","name":{"kind":"Name","value":"debt"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_stock"}},{"kind":"Field","name":{"kind":"Name","value":"ex_ante_stock"}},{"kind":"Field","name":{"kind":"Name","value":"total_ex_post"}},{"kind":"Field","name":{"kind":"Name","value":"total_ex_ante"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<AnnualQuery, AnnualQueryVariables>;
export const CumulativeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Cumulative"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cumulative"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time_period"}},{"kind":"Field","name":{"kind":"Name","value":"emissions"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_issued"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_purchased"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_retired"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"actual_rate"}},{"kind":"Field","name":{"kind":"Name","value":"delta"}},{"kind":"Field","name":{"kind":"Name","value":"debt"}},{"kind":"Field","name":{"kind":"Name","value":"ex_post_stock"}},{"kind":"Field","name":{"kind":"Name","value":"ex_ante_stock"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<CumulativeQuery, CumulativeQueryVariables>;
export const FinancialAnalysisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FinancialAnalysis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"financialAnalysis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"all_time_avg_issued_price"}},{"kind":"Field","name":{"kind":"Name","value":"all_time_avg_purchased_price"}},{"kind":"Field","name":{"kind":"Name","value":"all_time_avg_price"}},{"kind":"Field","name":{"kind":"Name","value":"avg_issued_price"}},{"kind":"Field","name":{"kind":"Name","value":"avg_purchased_price"}},{"kind":"Field","name":{"kind":"Name","value":"avg_price"}},{"kind":"Field","name":{"kind":"Name","value":"cumulative_emission_debt"}},{"kind":"Field","name":{"kind":"Name","value":"cumulative_total_amount"}},{"kind":"Field","name":{"kind":"Name","value":"emission_debt"}},{"kind":"Field","name":{"kind":"Name","value":"total_amount"}},{"kind":"Field","name":{"kind":"Name","value":"total_issued_amount"}},{"kind":"Field","name":{"kind":"Name","value":"total_purchased_amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<FinancialAnalysisQuery, FinancialAnalysisQueryVariables>;
export const GetOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"order_for_year"}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"deficit"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderQuery, GetOrderQueryVariables>;
export const ProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<ProjectsQuery, ProjectsQueryVariables>;
export const ProjectByDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectBy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"field"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectBy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"field"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"localization"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"certifier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"developper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"global_data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"allocated_units"}},{"kind":"Field","name":{"kind":"Name","value":"available_ex_post"}},{"kind":"Field","name":{"kind":"Name","value":"available_ex_ante"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectByQuery, ProjectByQueryVariables>;
export const GetProjectsMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectsMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjectMetrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"green"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"red"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yellow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"localization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"iso"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"standards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avoidance"}},{"kind":"Field","name":{"kind":"Name","value":"removal"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectsMetricsQuery, GetProjectsMetricsQueryVariables>;
export const GetStockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisualizationViewType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"available"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page_info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"has_next_page"}},{"kind":"Field","name":{"kind":"Name","value":"has_previous_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_page"}}]}}]}}]}}]} as unknown as DocumentNode<GetStockQuery, GetStockQueryVariables>;