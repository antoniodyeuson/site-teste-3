import Subscription from '../models/Subscription';

export const calculateEarnings = async (creatorId: string) => {
  try {
    // Busca todas as assinaturas ativas do criador
    const subscriptions = await Subscription.find({
      creatorId,
      status: 'active'
    });

    // Calcula o total de ganhos com assinaturas
    const totalEarnings = subscriptions.reduce((sum, subscription) => {
      // Aplica a taxa da plataforma (15%)
      const platformFee = subscription.price * 0.15;
      const creatorEarning = subscription.price - platformFee;
      return sum + creatorEarning;
    }, 0);

    return totalEarnings;
  } catch (error) {
    console.error('Error calculating earnings:', error);
    return 0;
  }
}; 