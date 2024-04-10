import { CreateSubscriptionModal } from '../../../shared/components/modals/CreateSubscriptionModal';
import { SubscriptionContent } from './Content';

export function SubscriptionsPage() {
  return (
    <>
      <SubscriptionContent />
      <CreateSubscriptionModal />
    </>
  );
}
