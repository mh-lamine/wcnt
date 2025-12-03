import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export function PleaseLogin({ message = "Please login to continue" }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <div className="text-center space-y-6 max-w-3/4 w-md">
        <div className="w-20 h-20 mx-auto bg-brand/10 rounded-full flex items-center justify-center">
          <LogIn className="w-10 h-10 text-brand" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            On ne s'est pas encore présentés !
          </h2>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium"
          >
            <LogIn className="w-4 h-4" />
            Se connecter
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand text-brand rounded-lg hover:bg-brand/5 transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
