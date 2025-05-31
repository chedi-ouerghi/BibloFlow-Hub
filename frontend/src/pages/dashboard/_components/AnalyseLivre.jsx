import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { motion } from 'framer-motion';

const AnalyseLivre = ({ livres }) => {
  // Calcul des statistiques
  const totalLivres = livres.length;
  const livresPublies = livres.filter(l => l.statut === 'published').length;
  const livresBrouillon = livres.filter(l => l.statut === 'draft').length;

  // Données pour le graphique de statut
  const statutData = [
    { name: 'Publiés', value: livresPublies },
    { name: 'Brouillons', value: livresBrouillon },
  ];

  // Données pour le graphique des notes moyennes
  const notesData = livres
    .filter(livre => livre.noteMoyenne)
    .map(livre => ({
      name: livre.titre.substring(0, 20) + (livre.titre.length > 20 ? '...' : ''),
      note: livre.noteMoyenne,
    }));

  // Couleurs pour le pie chart
  const COLORS = ['#4f46e5', '#fbbf24'];

  // Données pour le graphique des commentaires
  const commentairesData = livres
    .sort((a, b) => b.nombreCommentaires - a.nombreCommentaires)
    .slice(0, 5)
    .map(livre => ({
      name: livre.titre.substring(0, 20) + (livre.titre.length > 20 ? '...' : ''),
      commentaires: livre.nombreCommentaires,
    }));

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4"
    >
      {/* Cartes statistiques */}
      <motion.div variants={itemAnimation} className="xl:col-span-4">
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Vue d'ensemble de la bibliothèque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-indigo-600">{totalLivres}</p>
                <p className="text-sm font-medium text-gray-600">Total des livres</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-green-500">{livresPublies}</p>
                <p className="text-sm font-medium text-gray-600">Publiés</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-amber-500">{livresBrouillon}</p>
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphique de statut */}
      <motion.div variants={itemAnimation} className="xl:col-span-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Distribution des Statuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphique des notes moyennes */}
      <motion.div variants={itemAnimation} className="xl:col-span-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Notes Moyennes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={notesData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="note" 
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphique des commentaires */}
      <motion.div variants={itemAnimation} className="xl:col-span-4">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Top 5 des Livres les Plus Commentés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commentairesData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="commentaires" 
                    fill="#fbbf24"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnalyseLivre;