/**
 * External dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import Gridicon from 'gridicons';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

/**
 * WooCommerce dependencies
 */
import { Card } from '@woocommerce/components';
import { OPTIONS_STORE_NAME } from '@woocommerce/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { recordEvent } from 'lib/tracks';
import WelcomeImage from './images/welcome.svg';

class WelcomeCard extends Component {
	constructor( props ) {
		super( props );

		this.hide = this.hide.bind( this );
	}

	hide() {
		this.props.updateOptions( {
			woocommerce_marketing_overview_welcome_hidden: 'yes',
		} );

		recordEvent( 'marketing_intro_close', {} );
	}

	render() {
		if ( this.props.isHidden ) {
			return null;
		}

		return (
			<Card className="woocommerce-marketing-overview-welcome-card">
				<Button
					label={ __( 'Hide', 'woocommerce-admin' ) }
					onClick={ this.hide }
					className="woocommerce-marketing-overview-welcome-card__hide-button"
				>
					<Gridicon icon="cross" />
				</Button>
				<img src={ WelcomeImage } alt="" />
				<h3>
					{ __(
						'Grow your customer base and increase your sales with marketing tools built for WooCommerce',
						'woocommerce-admin'
					) }
				</h3>
			</Card>
		);
	}
}

export default compose(
	withSelect( ( select ) => {
		const { getOption, isOptionsUpdating } = select( OPTIONS_STORE_NAME );
		const isUpdateRequesting = isOptionsUpdating();

		return {
			isHidden:
				getOption( 'woocommerce_marketing_overview_welcome_hidden' ) ===
					'yes' || isUpdateRequesting,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { updateOptions } = dispatch( OPTIONS_STORE_NAME );
		return {
			updateOptions,
		};
	} )
)( WelcomeCard );
