import ansiedade from './ansiedade';
import medo from './medo';
import identidade from './identidade';
import autoestima from './autoestima';
import fe from './fe';
import oracao from './oracao';
import sabedoria from './sabedoria';
import proposito from './proposito';
import santidade from './santidade';
import amorDeDeus from './10-amor-de-deus';
import perdao from './11-perdao';
import espiritoSanto from './12-espirito-santo';
import vencendoATentacao from './13-vencendo-a-tentacao';
import esperanca from './14-esperanca';
import gratidao from './15-gratidao';
import disciplina from './16-disciplina';
import obediencia from './17-obediencia';
import confiancaEmDeus from './18-confianca-em-deus';
import amizades from './amizades';
import relacionamentos from './relacionamentos';
import escolaEEstudos from './escola-e-estudos';
import chamado from './chamado';
import personagensBiblicos from './personagens-biblicos';
import conhecendoJesus from './conhecendo-jesus';
import evangelhos from './evangelhos';
import salmosDiarios from './salmos-diarios';
import proverbiosJovens from './proverbios-jovens';

const ALL_PLANS = [
  ansiedade,
  medo,
  identidade,
  autoestima,
  fe,
  oracao,
  sabedoria,
  proposito,
  santidade,
  amorDeDeus,
  perdao,
  espiritoSanto,
  vencendoATentacao,
  esperanca,
  gratidao,
  disciplina,
  obediencia,
  confiancaEmDeus,
  amizades,
  relacionamentos,
  escolaEEstudos,
  chamado,
  personagensBiblicos,
  conhecendoJesus,
  evangelhos,
  salmosDiarios,
  proverbiosJovens,
];

export function getAllPlans() {
  return ALL_PLANS;
}

export function getPlanById(id) {
  return ALL_PLANS.find((p) => p.id === id) || null;
}

export function getPlansByCategory(category) {
  return ALL_PLANS.filter((p) => p.category === category);
}

export function getCategories() {
  const cats = [...new Set(ALL_PLANS.map((p) => p.category))];
  return cats;
}

export { default as ansiedade } from './ansiedade';
export { default as medo } from './medo';
export { default as identidade } from './identidade';
export { default as autoestima } from './autoestima';
export { default as fe } from './fe';
export { default as oracao } from './oracao';
export { default as sabedoria } from './sabedoria';
export { default as proposito } from './proposito';
export { default as santidade } from './santidade';
export { default as amorDeDeus } from './10-amor-de-deus';
export { default as perdao } from './11-perdao';
export { default as espiritoSanto } from './12-espirito-santo';
export { default as vencendoATentacao } from './13-vencendo-a-tentacao';
export { default as esperanca } from './14-esperanca';
export { default as gratidao } from './15-gratidao';
export { default as disciplina } from './16-disciplina';
export { default as obediencia } from './17-obediencia';
export { default as confiancaEmDeus } from './18-confianca-em-deus';
export { default as amizades } from './amizades';
export { default as relacionamentos } from './relacionamentos';
export { default as escolaEEstudos } from './escola-e-estudos';
export { default as chamado } from './chamado';
export { default as personagensBiblicos } from './personagens-biblicos';
export { default as conhecendoJesus } from './conhecendo-jesus';
export { default as evangelhos } from './evangelhos';
export { default as salmosDiarios } from './salmos-diarios';
export { default as proverbiosJovens } from './proverbios-jovens';
