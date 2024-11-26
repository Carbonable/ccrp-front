import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query GetOrder($view: VisualizationViewType!, $pagination: Pagination) {
    getOrder(view: $view, pagination: $pagination) {
      data {
        created_at,
        order_for_year,
        vintage,
        quantity,
        deficit,
        status,
      }
      page_info {
        has_next_page
        has_previous_page
        total_page
      }
    }
  }
`;
