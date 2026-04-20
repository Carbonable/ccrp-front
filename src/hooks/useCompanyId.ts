import { useOrganization } from '@clerk/nextjs';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_COMPANY_BY_CLERK_ORG = gql`
  query CompanyByClerkOrg($clerkOrgId: String!) {
    companyByClerkOrg(clerkOrgId: $clerkOrgId) {
      id
      name
      slug
    }
  }
`;

/**
 * Returns the company ID mapped to the active Clerk organization.
 * - Loading state → '__loading__'
 * - No matching company → '__none__'
 * Both fake IDs will return empty results from all queries (no data leak).
 */
export function useCompanyId(): string {
  const { organization, isLoaded } = useOrganization();
  const orgId = organization?.id;

  const { data, loading } = useQuery<any>(GET_COMPANY_BY_CLERK_ORG, {
    variables: { clerkOrgId: orgId },
    skip: !orgId,
  });

  // Still loading org or query
  if (!isLoaded || loading) return '__loading__';

  // Org resolved but no matching company in DB
  if (!data?.companyByClerkOrg?.id) return '__none__';

  return data.companyByClerkOrg.id;
}
