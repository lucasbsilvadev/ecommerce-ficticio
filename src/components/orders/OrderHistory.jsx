// OrderHistory.js - Componente para exibir histórico de pedidos
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './OrderHistory.css';

export default function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await api.getOrders(userId);
        setOrders(ordersData.orders || []);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        setError('Erro ao carregar pedidos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadOrders();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { text: 'Pendente', class: 'status-pending' },
      'processing': { text: 'Processando', class: 'status-processing' },
      'shipped': { text: 'Enviado', class: 'status-shipped' },
      'delivered': { text: 'Entregue', class: 'status-delivered' },
      'cancelled': { text: 'Cancelado', class: 'status-cancelled' }
    };
    
    return statusMap[status] || { text: status, class: 'status-unknown' };
  };

  if (loading) {
    return (
      <div className="order-history">
        <div className="loading">Carregando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history">
        <div className="no-orders">
          <p>Nenhum pedido encontrado.</p>
          <p>Faça sua primeira compra!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      {orders.map((order) => {
        const statusInfo = getStatusInfo(order.status);
        
        return (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <span className="order-id">Pedido #{order.id}</span>
              <span className="order-date">{formatDate(order.created_at)}</span>
              <span className={`order-status ${statusInfo.class}`}>
                {statusInfo.text}
              </span>
            </div>
            
            <div className="order-products">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="order-product">
                  {item.quantity}x {item.product_name}
                </div>
              ))}
            </div>
            
            <div className="order-footer">
              <span className="order-value">
                Total: {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}