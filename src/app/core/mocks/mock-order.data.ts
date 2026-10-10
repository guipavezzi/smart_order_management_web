import { OrderResponse, Status } from '../models/order.model';

const now = Date.now();

// Pedidos simulados para exibição realista no Painel e no Histórico
let mockOrders: (OrderResponse & { archived?: boolean })[] = [
  // Pedidos ativos (no painel)
  {
    id: 'ord-101',
    table: 4,
    ordered: 'Hambúrguer Artesanal Smash',
    createdAt: new Date(now - 1000 * 60 * 4).toISOString(), // 4 min atrás -> Em Preparação
    status: Status.InPreparation,
    observation: 'Sem picles e bacon bem crocante.',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  },
  {
    id: 'ord-102',
    table: 2,
    ordered: 'Pizza Margherita Especial',
    createdAt: new Date(now - 1000 * 60 * 16).toISOString(), // 16 min atrás -> Atenção
    status: Status.Attention,
    observation: 'Massa fina e borda bem assada.',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  },
  {
    id: 'ord-103',
    table: 7,
    ordered: 'Costela Barbecue com Fritas',
    createdAt: new Date(now - 1000 * 60 * 38).toISOString(), // 38 min atrás -> Atrasado
    status: Status.Delayed,
    observation: 'Molho barbecue à parte.',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  },
  {
    id: 'ord-104',
    table: 12,
    ordered: 'Salmão Grelhado com Legumes',
    createdAt: new Date(now - 1000 * 60 * 6).toISOString(), // 6 min atrás -> Em Preparação
    status: Status.InPreparation,
    observation: 'Ponto do salmão: bem passado.',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  },
  {
    id: 'ord-105',
    table: 1,
    ordered: 'Risoto de Cogumelos Frescos',
    createdAt: new Date(now - 1000 * 60 * 19).toISOString(), // 19 min atrás -> Atenção
    status: Status.Attention,
    observation: 'Sem queijo parmesão no topo.',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  },

  // Pedidos concluídos do turno atual
  {
    id: 'ord-201',
    table: 3,
    ordered: 'Batata Rústica Trufada',
    createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
    status: Status.Completed,
    observation: 'Porção grande com maionese da casa.',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  },
  {
    id: 'ord-202',
    table: 5,
    ordered: 'Petit Gâteau de Chocolate',
    createdAt: new Date(now - 1000 * 60 * 50).toISOString(),
    status: Status.Completed,
    observation: 'Com sorvete de baunilha.',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  },

  // Pedidos de turnos anteriores (para a tela de Histórico)
  {
    id: 'ord-301',
    table: 4,
    ordered: 'Hambúrguer Artesanal Smash',
    createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    status: Status.Completed,
    observation: 'Ponto da carne ao ponto para mal.',
    shiftReference: 'Turno Noite - Ontem',
    archived: true
  },
  {
    id: 'ord-302',
    table: 8,
    ordered: 'Pizza Margherita Especial',
    createdAt: new Date(now - 1000 * 60 * 60 * 25).toISOString(),
    status: Status.Completed,
    observation: 'Adicionar azeitonas pretas.',
    shiftReference: 'Turno Noite - Ontem',
    archived: true
  },
  {
    id: 'ord-303',
    table: 2,
    ordered: 'Costela Barbecue com Fritas',
    createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
    status: Status.Completed,
    observation: 'Fritas sem sal.',
    shiftReference: 'Turno Noite - Ontem',
    archived: true
  },
  {
    id: 'ord-401',
    table: 6,
    ordered: 'Salmão Grelhado com Legumes',
    createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    status: Status.Completed,
    observation: 'Legumes no vapor.',
    shiftReference: 'Turno Almoço - 2 dias atrás',
    archived: true
  },
  {
    id: 'ord-402',
    table: 9,
    ordered: 'Risoto de Cogumelos Frescos',
    createdAt: new Date(now - 1000 * 60 * 60 * 49).toISOString(),
    status: Status.Completed,
    observation: 'Adicionar azeite trufado.',
    shiftReference: 'Turno Almoço - 2 dias atrás',
    archived: true
  }
];

export function getMockOrders(
  activeOnly = false,
  completedOnly = false,
  includeArchived = false
): OrderResponse[] {
  return mockOrders.filter(o => {
    if (!includeArchived && o.archived) return false;
    if (activeOnly && o.status === Status.Completed) return false;
    if (completedOnly && o.status !== Status.Completed) return false;
    return true;
  });
}

export function createMockOrder(orderData: Partial<OrderResponse>): OrderResponse {
  const newOrder: OrderResponse & { archived?: boolean } = {
    id: 'ord-' + Math.floor(100 + Math.random() * 900),
    table: Number(orderData.table) || 1,
    ordered: orderData.ordered || 'Item do Cardápio',
    createdAt: new Date().toISOString(),
    status: Status.InPreparation,
    observation: orderData.observation || '',
    shiftReference: 'Expediente Atual (Em andamento)',
    archived: false
  };
  mockOrders = [newOrder, ...mockOrders];
  return newOrder;
}

export function updateMockOrderStatus(id: string, status: Status): { success: boolean } {
  const target = mockOrders.find(o => o.id === id);
  if (target) {
    target.status = status;
    return { success: true };
  }
  return { success: false };
}

export function updateMockOrder(id: string, orderData: Partial<OrderResponse>): OrderResponse {
  const index = mockOrders.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error('Order not found');
  }
  const updated = {
    ...mockOrders[index],
    ...orderData,
    id: mockOrders[index].id,
    table: Number(orderData.table) || mockOrders[index].table
  };
  mockOrders[index] = updated;
  return updated;
}

export function deleteMockOrder(id: string): boolean {
  const prevCount = mockOrders.length;
  mockOrders = mockOrders.filter(o => o.id !== id);
  return mockOrders.length < prevCount;
}

export function closeMockShift(): { message: string } {
  const shiftName = `Turno Encerrado - ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  let archivedCount = 0;

  mockOrders.forEach(o => {
    if (o.status === Status.Completed && !o.archived) {
      o.archived = true;
      o.shiftReference = shiftName;
      archivedCount++;
    }
  });

  return { message: `${shiftName} (${archivedCount} pedidos arquivados)` };
}

export function getMockMetrics() {
  const activeOrders = mockOrders.filter(o => o.status !== Status.Completed && !o.archived);
  const inPreparation = activeOrders.filter(o => o.status === Status.InPreparation).length;
  const attention = activeOrders.filter(o => o.status === Status.Attention).length;
  const delayed = activeOrders.filter(o => o.status === Status.Delayed).length;

  let maxMinutes = 0;
  activeOrders.forEach(o => {
    const diff = (Date.now() - new Date(o.createdAt).getTime()) / 60000;
    if (diff > maxMinutes) {
      maxMinutes = Math.floor(diff);
    }
  });

  return {
    inPreparation,
    attention,
    delayed,
    longestWaitTime: maxMinutes > 0 ? `${maxMinutes} min` : '0 min',
    averagePreparationTime: 14
  };
}

export function getMockAnalytics() {
  return {
    totalCompletedOrders: 64,
    averagePreparationTime: 14,
    mostActiveTable: 4,
    efficiencyRate: 91,
    peakHours: {
      '11:00': 4,
      '12:00': 22,
      '13:00': 35,
      '14:00': 18,
      '19:00': 28,
      '20:00': 42,
      '21:00': 31,
      '22:00': 12
    },
    topDishes: {
      'Hambúrguer Artesanal Smash': 29,
      'Pizza Margherita Especial': 24,
      'Batata Rústica Trufada': 19,
      'Costela Barbecue com Fritas': 15,
      'Risoto de Cogumelos Frescos': 11
    }
  };
}
