import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { useToast } from '../../../components/ui/use-toast';
import { auteurApi } from '../../../api/auteurapi';

const MesLecteursPage = () => {
  const [lecteurs, setLecteurs] = useState([]);
  const { toast } = useToast();

  const fetchLecteurs = async () => {
    try {
      const data = await auteurApi.getMesLecteurs();
      setLecteurs(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les lecteurs"
      });
    }
  };

  useEffect(() => {
    fetchLecteurs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Users className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold">Mes Lecteurs</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lecteurs.map((lecteur) => (
              <TableRow key={lecteur._id}>
                <TableCell>{lecteur.username}</TableCell>
                <TableCell>{lecteur.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MesLecteursPage;