import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Check, X } from 'lucide-react';

const PendingAuthors = ({ authors, onValidate, onReject, onRefresh }) => {

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Auteurs en attente de validation</h2>
      <div className="space-y-4">
        {authors.length === 0 ? (
          <p className="text-gray-500">Aucun auteur en attente de validation</p>
        ) : (
          authors.map((author) => (
            <div key={author._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">{author.nom}</h3>
                <p className="text-sm text-gray-600">{author.email}</p>
                <div className="mt-1">
                  <Badge variant="outline">En attente</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600"
                  onClick={() => onValidate(author._id)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Valider
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => onReject(author._id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Rejeter
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default PendingAuthors;
