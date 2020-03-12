/**
 * External dependencies
 */
import { shallow } from 'enzyme';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { DismissModal } from '../index.js';

describe( 'Option Save events in DismissModal', () => {
	const spyUpdateOptions = jest.fn();

	let dismissModalWrapper;

	beforeEach( () => {
		dismissModalWrapper = shallow(
			<DismissModal
				visible={ true }
				onClose={ jest.fn() }
				onCloseAll={ jest.fn() }
				trackBannerEvent={ jest.fn() }
				updateOptions={ spyUpdateOptions }
			/>
		);
	} );

	test( 'Should save permanent dismissal', () => {
		const permanentDismissTimestamp = -1;
		const actionButtons = dismissModalWrapper.find( Button );
		expect( actionButtons.length ).toBe( 2 );
		const permanenttDismissButton = actionButtons.last();
		permanenttDismissButton.simulate( 'click' );
		expect( spyUpdateOptions ).toHaveBeenCalledWith( {
			woocommerce_shipping_dismissed_timestamp: permanentDismissTimestamp,
		} );
	} );

	test( 'Should save temporary dismissal', () => {
		// Mock Date.now() so a known timestamp will be saved.
		const mockDate = 123456;
		const realDateNow = Date.now.bind( global.Date );
		global.Date.now = jest.fn( () => mockDate );

		const actionButtons = dismissModalWrapper.find( Button );
		expect( actionButtons.length ).toBe( 2 );
		const remindMeLaterButton = actionButtons.first();
		remindMeLaterButton.simulate( 'click' );
		expect( spyUpdateOptions ).toHaveBeenCalledWith( {
			woocommerce_shipping_dismissed_timestamp: mockDate,
		} );

		// Restore Date.now().
		global.Date.now = realDateNow;
	} );
} );