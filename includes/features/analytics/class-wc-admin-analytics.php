<?php
/**
 * WooCommerce Analytics.
 * NOTE: DO NOT edit this file in WooCommerce core, this is generated from woocommerce-admin.
 *
 * @package Woocommerce Admin
 */

/**
 * Contains backend logic for the Analytics feature.
 */
class WC_Admin_Analytics {
	/**
	 * Class instance.
	 *
	 * @var WC_Admin_Analytics instance
	 */
	protected static $instance = null;

	/**
	 * Get class instance.
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Hook into WooCommerce.
	 */
	public function __construct() {
		add_filter( 'woocommerce_component_settings_preload_endpoints', array( $this, 'add_preload_endpoints' ) );
		add_filter( 'wc_admin_get_user_data_fields', array( $this, 'add_user_data_fields' ) );
		add_action( 'admin_menu', array( $this, 'register_pages' ) );
	}

	/**
	 * Preload data from the countries endpoint.
	 *
	 * @param array $endpoints Array of preloaded endpoints.
	 * @return array
	 */
	public function add_preload_endpoints( $endpoints ) {
		$endpoints['countries'] = '/wc/v4/data/countries';
		return $endpoints;
	}

	/**
	 * Adds fields so that we can store user preferences for the columns to display on a report.
	 *
	 * @param array $user_data_fields User data fields.
	 * @return array
	 */
	public function add_user_data_fields( $user_data_fields ) {
		return array_merge(
			$user_data_fields,
			array(
				'categories_report_columns',
				'coupons_report_columns',
				'customers_report_columns',
				'orders_report_columns',
				'products_report_columns',
				'revenue_report_columns',
				'taxes_report_columns',
				'variations_report_columns',
			)
		);
	}

	/**
	 * Registers report pages.
	 */
	public function register_pages() {
		$report_pages = array(
			array(
				'id'       => 'woocommerce-analytics',
				'title'    => __( 'Analytics', 'woocommerce-admin' ),
				'path'     => '/analytics/revenue',
				'icon'     => 'dashicons-chart-bar',
				'position' => 56, // After WooCommerce & Product menu items.
			),
			array(
				'id'     => 'woocommerce-analytics-revenue',
				'title'  => __( 'Revenue', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/revenue',
			),
			array(
				'id'     => 'woocommerce-analytics-orders',
				'title'  => __( 'Orders', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/orders',
			),
			array(
				'id'     => 'woocommerce-analytics-products',
				'title'  => __( 'Products', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/products',
			),
			array(
				'id'     => 'woocommerce-analytics-categories',
				'title'  => __( 'Categories', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/categories',
			),
			array(
				'id'     => 'woocommerce-analytics-coupons',
				'title'  => __( 'Coupons', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/coupons',
			),
			array(
				'id'     => 'woocommerce-analytics-taxes',
				'title'  => __( 'Taxes', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/taxes',
			),
			array(
				'id'     => 'woocommerce-analytics-downloads',
				'title'  => __( 'Downloads', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/downloads',
			),
			'yes' === get_option( 'woocommerce_manage_stock' ) ? array(
				'id'     => 'woocommerce-analytics-stock',
				'title'  => __( 'Stock', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/stock',
			) : null,
			array(
				'id'     => 'woocommerce-analytics-customers',
				'title'  => __( 'Customers', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/customers',
			),
			array(
				'id'     => 'woocommerce-analytics-settings',
				'title'  => __( 'Settings', 'woocommerce-admin' ),
				'parent' => 'woocommerce-analytics',
				'path'   => '/analytics/settings',
			),
		);

		$report_pages = apply_filters( 'woocommerce_admin_report_menu_items', $report_pages );

		foreach ( $report_pages as $report_page ) {
			if ( ! is_null( $report_page ) ) {
				wc_admin_register_page( $report_page );
			}
		}
	}
}
