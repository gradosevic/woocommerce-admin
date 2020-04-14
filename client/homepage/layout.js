/**
 * External dependencies
 */
import {
	Fragment,
	Suspense,
	lazy,
	useState,
	useRef,
	useEffect,
} from '@wordpress/element';
import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withSelect } from '@wordpress/data';

/**
 * WooCommerce dependencies
 */
import { OPTIONS_STORE_NAME } from '@woocommerce/data';

/**
 * Internal dependencies
 */
import QuickLinks from '../quick-links';
import StatsOverview from './stats-overview';
import './style.scss';
import { isOnboardingEnabled } from 'dashboard/utils';
import TaskListPlaceholder from '../task-list/placeholder';

const TaskList = lazy( () =>
	import( /* webpackChunkName: "task-list" */ '../task-list' )
);

export const Layout = ( props ) => {
	const [ showInbox, setShowInbox ] = useState( true );
	const [ isContentSticky, setIsContentSticky ] = useState( false );
	const content = useRef( null );
	const maybeStickContent = () => {
		if ( ! content.current ) {
			return;
		}
		const { bottom } = content.current.getBoundingClientRect();
		const shouldBeSticky = showInbox && bottom < window.innerHeight;

		setIsContentSticky( shouldBeSticky );
	};

	useEffect( () => {
		maybeStickContent();
		window.addEventListener( 'resize', maybeStickContent );

		return () => {
			window.removeEventListener( 'resize', maybeStickContent );
		};
	}, [] );

	const {
		query,
		requestingTaskList,
		taskListComplete,
		taskListHidden,
	} = props;
	const isTaskListEnabled = taskListHidden === false && ! taskListComplete;
	const isDashboardShown = ! isTaskListEnabled || ! query.task;

	const renderColumns = () => {
		return (
			<Fragment>
				{ showInbox && (
					<div className="woocommerce-homepage-column is-inbox">
						<div className="temp-content">
							<Button
								isPrimary
								onClick={ () => {
									setShowInbox( false );
								} }
							>
								Dismiss All
							</Button>
						</div>
						<div className="temp-content" />
						<div className="temp-content" />
						<div className="temp-content" />
						<div className="temp-content" />
						<div className="temp-content" />
						<div className="temp-content" />
					</div>
				) }
				<div
					className="woocommerce-homepage-column"
					ref={ content }
					style={ {
						position: isContentSticky ? 'sticky' : 'static',
					} }
				>
					{ isTaskListEnabled && renderTaskList() }
					<StatsOverview />
					<QuickLinks />
				</div>
			</Fragment>
		);
	};

	const renderTaskList = () => {
		if ( requestingTaskList ) {
			return <TaskListPlaceholder />;
		}

		return (
			<Suspense fallback={ <TaskListPlaceholder /> }>
				<TaskList query={ query } />
			</Suspense>
		);
	};

	return (
		<div
			className={ classnames( 'woocommerce-homepage', {
				hasInbox: showInbox,
			} ) }
		>
			{ isDashboardShown
				? renderColumns()
				: isTaskListEnabled && renderTaskList() }
		</div>
	);
};

Layout.propTypes = {
	/**
	 * If the task list option is being fetched.
	 */
	requestingTaskList: PropTypes.bool.isRequired,
	/**
	 * If the task list has been completed.
	 */
	taskListComplete: PropTypes.bool,
	/**
	 * If the task list is hidden.
	 */
	taskListHidden: PropTypes.bool,
	/**
	 * Page query, used to determine the current task if any.
	 */
	query: PropTypes.object.isRequired,
};

export default compose(
	withSelect( ( select ) => {
		const { getOption, isResolving } = select( OPTIONS_STORE_NAME );

		if ( isOnboardingEnabled() ) {
			return {
				taskListComplete:
					getOption( 'woocommerce_task_list_complete' ) === 'yes',
				taskListHidden:
					getOption( 'woocommerce_task_list_hidden' ) === 'yes',
				requestingTaskList:
					isResolving( 'getOption', [
						'woocommerce_task_list_complete',
					] ) ||
					isResolving( 'getOption', [
						'woocommerce_task_list_hidden',
					] ),
			};
		}

		return {
			requestingTaskList: false,
		};
	} )
)( Layout );
