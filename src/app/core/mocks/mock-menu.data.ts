import { CreateMenuRequest, MenuResponse } from '../models/menu.model';

const baseDishes = [
  // 1-15 Hambúrgueres e Sanduíches
  { name: 'Hambúrguer Artesanal Smash', min: 10, max: 18 },
  { name: 'Double Bacon Cheddar Burger', min: 12, max: 20 },
  { name: 'Gorgonzola & Caramelized Onion Burger', min: 12, max: 20 },
  { name: 'Chicken Crispy Supreme', min: 10, max: 18 },
  { name: 'Costela Burger Desfiada', min: 14, max: 22 },
  { name: 'Truffle Burger com Queijo Brie', min: 15, max: 25 },
  { name: 'Veggie Burger de Grão de Bico', min: 10, max: 18 },
  { name: 'Smash Salada Clássico', min: 8, max: 15 },
  { name: 'Monster Burger 4 Carnes', min: 18, max: 28 },
  { name: 'Sanduíche de Pernil com Vinagrete', min: 12, max: 20 },
  { name: 'Sanduíche de Pastrami Artesanal', min: 10, max: 18 },
  { name: 'Choripán com Chimichurri', min: 10, max: 16 },
  { name: 'Cheeseburger Clássico Americano', min: 8, max: 14 },
  { name: 'X-Bacon Egg Especial', min: 10, max: 18 },
  { name: 'Fish Burger com Molho Tártaro', min: 12, max: 20 },

  // 16-30 Pizzas & Calzones
  { name: 'Pizza Margherita Especial', min: 15, max: 25 },
  { name: 'Pizza Calabresa Artesanal com Cebola', min: 15, max: 25 },
  { name: 'Pizza Quatro Queijos Nobres', min: 15, max: 25 },
  { name: 'Pizza Pepperoni Supreme', min: 15, max: 25 },
  { name: 'Pizza Frango com Catupiry Original', min: 15, max: 25 },
  { name: 'Pizza Parma com Rúcula e Parmesão', min: 18, max: 28 },
  { name: 'Pizza Portuguesa Tradicional', min: 15, max: 25 },
  { name: 'Pizza Alho Negro e Burrata', min: 18, max: 28 },
  { name: 'Pizza Cogumelos Trufados', min: 18, max: 28 },
  { name: 'Pizza Doce Romeu e Julieta', min: 12, max: 20 },
  { name: 'Pizza Doce Banana com Canela', min: 12, max: 20 },
  { name: 'Calzone Clássico de Queijo e Presunto', min: 18, max: 28 },
  { name: 'Calzone de Carne Seca com Catupiry', min: 20, max: 30 },
  { name: 'Focaccia ao Alecrim e Flor de Sal', min: 10, max: 18 },
  { name: 'Pizza Napolitana com Molho Rústico', min: 15, max: 25 },

  // 31-45 Carnes, Grelhados & Churrasco
  { name: 'Costela Barbecue com Fritas', min: 20, max: 35 },
  { name: 'Picanha Angus Fatiada na Chapa', min: 18, max: 30 },
  { name: 'Bife Ancho com Manteiga de Ervas', min: 18, max: 30 },
  { name: 'Fraldinha na Mostarda Dijon', min: 20, max: 32 },
  { name: 'Filé Mignon ao Molho Madeira', min: 20, max: 30 },
  { name: 'Filé Mignon ao Poivre Vert', min: 20, max: 30 },
  { name: 'T-Bone Steak Angus', min: 25, max: 40 },
  { name: 'Churrasco Misto da Casa', min: 25, max: 40 },
  { name: 'Galeto Desossado na Brasa', min: 20, max: 32 },
  { name: 'Costelinha Suína ao Molho de Goiabada', min: 22, max: 35 },
  { name: 'Steak Tartare com Fritas', min: 12, max: 18 },
  { name: 'Escondidinho de Carne Seca', min: 18, max: 28 },
  { name: 'Strogonoff de Filé Mignon', min: 15, max: 25 },
  { name: 'Parmegiana de Carne com Espaguete', min: 20, max: 35 },
  { name: 'Parmegiana de Frango Gratinada', min: 18, max: 30 },

  // 46-60 Massas & Risotos
  { name: 'Risoto de Cogumelos Frescos', min: 18, max: 28 },
  { name: 'Risoto de Camarão com Limão Siciliano', min: 20, max: 30 },
  { name: 'Risoto de Brie com Aspargos e Damasco', min: 18, max: 28 },
  { name: 'Spaghetti alla Carbonara Tradicional', min: 14, max: 22 },
  { name: 'Fettuccine Alfredo com Tiras de Mignon', min: 16, max: 24 },
  { name: 'Penne ao Pesto Genovês com Tomate Confit', min: 14, max: 22 },
  { name: 'Ravioli de Costela ao Molho Roti', min: 18, max: 28 },
  { name: 'Gnocchi ao Molho Quatro Queijos', min: 15, max: 24 },
  { name: 'Gnocchi Frito com Ragù de Cordeiro', min: 18, max: 28 },
  { name: 'Lasanha à Bolonhesa Clássica', min: 22, max: 35 },
  { name: 'Lasanha Quatro Queijos com Espinafre', min: 20, max: 32 },
  { name: 'Tagliatelle com Frutos do Mar', min: 20, max: 30 },
  { name: 'Ravioli de Ricota com Nozes', min: 15, max: 24 },
  { name: 'Penne Arrabbiata Picante', min: 12, max: 20 },
  { name: 'Polenta Cremosa com Ragù de Linguiça', min: 15, max: 25 },

  // 61-75 Peixes & Frutos do Mar
  { name: 'Salmão Grelhado com Legumes Salteados', min: 15, max: 22 },
  { name: 'Tilápia com Crosta de Castanhas', min: 15, max: 24 },
  { name: 'Camarão Empanado com Catupiry', min: 15, max: 22 },
  { name: 'Moqueca Mista de Peixe e Camarão', min: 25, max: 40 },
  { name: 'Bacalhau à Lagareiro com Batatas ao Murro', min: 25, max: 40 },
  { name: 'Polvo Grelhado com Batatas Rústicas', min: 20, max: 35 },
  { name: 'Ceviche de Robalo com Chips de Batata Doce', min: 10, max: 16 },
  { name: 'Lula à Dorê com Molho Tártaro', min: 12, max: 18 },
  { name: 'Robalo Grelhado ao Molho de Ervas', min: 18, max: 28 },
  { name: 'Arroz de Frutos do Mar Especial', min: 22, max: 35 },
  { name: 'Bobó de Camarão Cremoso', min: 20, max: 32 },
  { name: 'Salmão ao Molho de Maracujá', min: 15, max: 24 },
  { name: 'Truta com Manteiga de Amêndoas', min: 15, max: 24 },
  { name: 'Peixe Frito Inteiro com Vinagrete', min: 22, max: 35 },
  { name: 'Camarões Salteados no Alho e Óleo', min: 12, max: 18 },

  // 76-88 Petiscos, Porções & Saladas
  { name: 'Batata Rústica Trufada com Alecrim', min: 8, max: 14 },
  { name: 'Batata Frita Tradicional Grande', min: 6, max: 12 },
  { name: 'Dadinhos de Tapioca com Geléia de Pimenta', min: 10, max: 16 },
  { name: 'Coxinha de Costela Sem Massa (6 un)', min: 12, max: 18 },
  { name: 'Anéis de Cebola Empanados (Onion Rings)', min: 8, max: 14 },
  { name: 'Bruschetta Italiana Tradicional (4 un)', min: 8, max: 14 },
  { name: 'Carpaccio de Carne com Alcaparras e Parmesão', min: 8, max: 12 },
  { name: 'Provolone à Milanesa Crocante', min: 10, max: 16 },
  { name: 'Isca de Frango Empanada com Molho Honey Mustard', min: 10, max: 16 },
  { name: 'Salada Caesar com Tiras de Frango Grelhado', min: 10, max: 16 },
  { name: 'Salada Caprese com Pesto e Burrata', min: 8, max: 14 },
  { name: 'Tábua de Frios e Queijos Nobres', min: 10, max: 16 },
  { name: 'Mandioca Frita com Manteiga de Garrafa', min: 10, max: 16 },

  // 89-95 Sobremesas
  { name: 'Petit Gâteau de Chocolate com Sorvete', min: 10, max: 15 },
  { name: 'Pudim de Leite Condensado da Vovó', min: 5, max: 10 },
  { name: 'Cheesecake com Calda de Frutas Vermelhas', min: 5, max: 10 },
  { name: 'Torta Holandesa Tradicional', min: 5, max: 10 },
  { name: 'Brownie de Chocolate com Nozes e Calda Quente', min: 8, max: 14 },
  { name: 'Tiramisù Clássico Italiano', min: 5, max: 10 },
  { name: 'Churros com Doce de Leite Viçosa', min: 10, max: 15 },

  // 96-100 Bebidas & Drinks
  { name: 'Suco de Laranja Natural 500ml', min: 5, max: 10 },
  { name: 'Limonada Suíça Especial 500ml', min: 5, max: 10 },
  { name: 'Chopp Artesanal IPA 500ml', min: 3, max: 6 },
  { name: 'Chopp Pilsen Trincando 500ml', min: 3, max: 6 },
  { name: 'Soda Italiana de Maçã Verde', min: 5, max: 8 }
];

let mockMenus: MenuResponse[] = baseDishes.map((dish, index) => ({
  id: `menu-${index + 1}`,
  name: dish.name,
  minPreparationTimeInMinutes: dish.min,
  maxPreparationTimeInMinutes: dish.max,
  createdAt: new Date(Date.now() - (100 - index) * 3600000 * 4).toISOString()
}));

export function getMockMenus(): MenuResponse[] {
  return [...mockMenus];
}

export function createMockMenu(request: CreateMenuRequest): MenuResponse {
  const newMenu: MenuResponse = {
    id: 'menu-' + Math.random().toString(36).substring(2, 9),
    name: request.name,
    minPreparationTimeInMinutes: request.minPreparationTimeInMinutes,
    maxPreparationTimeInMinutes: request.maxPreparationTimeInMinutes,
    createdAt: new Date().toISOString()
  };
  mockMenus = [newMenu, ...mockMenus];
  return newMenu;
}

export function updateMockMenu(id: string, request: CreateMenuRequest): MenuResponse {
  const index = mockMenus.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('Menu item not found');
  }
  const updated: MenuResponse = {
    ...mockMenus[index],
    name: request.name,
    minPreparationTimeInMinutes: request.minPreparationTimeInMinutes,
    maxPreparationTimeInMinutes: request.maxPreparationTimeInMinutes,
    updatedAt: new Date().toISOString()
  };
  mockMenus[index] = updated;
  return updated;
}

export function deleteMockMenu(id: string): boolean {
  const beforeCount = mockMenus.length;
  mockMenus = mockMenus.filter(m => m.id !== id);
  return mockMenus.length < beforeCount;
}
