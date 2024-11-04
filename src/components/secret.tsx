'use client' // Indique que c'est un composant client-side (exécuté dans le navigateur)

import { useState, useEffect } from 'react'
import { createSecret, getSecret } from '@/actions/secretActions'

const Secret = () => {
  // Définition des états (variables réactives)
  const [secret, setSecret] = useState('') // Stocke le secret actuel
  const [content, setContent] = useState('') // Stocke le contenu du textarea
  const [error, setError] = useState('') // Stocke les messages d'erreur

  // useEffect s'exécute au montage du composant
  useEffect(() => {
    const loadSecret = async () => {
      const result = await getSecret() // Récupère le secret depuis le serveur
      if (result.success) {
        setSecret(result.content || '') // Met à jour l'état avec le secret récupéré
      } else {
        setError('Erreur de chargement') // Affiche une erreur si la récupération échoue
      }
    }
    loadSecret()
  }, []) // Le tableau vide signifie que l'effet ne s'exécute qu'une fois au montage

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Empêche le rechargement de la page
    
    // Validation : vérifie que le contenu n'est pas vide
    if (!content) {
      setError('Le secret ne peut pas être vide')
      return
    }

    // Sauvegarde du nouveau secret
    const result = await createSecret(content)
    if (result.success) {
      setContent('') // Vide le textarea
      // Recharge le secret mis à jour
      const newSecret = await getSecret()
      if (newSecret.success) {
        setSecret(newSecret.content || '')
      }
    } else {
      setError('Erreur de sauvegarde')
    }
  }

  // Interface utilisateur
  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Affichage du secret actuel */}
          <div className="mb-5">Secret : {secret}</div>
          
          {/* Champ de saisie du nouveau secret */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Entrez votre secret..."
            className="w-full p-2 border rounded"
          />
          
          {/* Affichage conditionnel des erreurs */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        
        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sauvegarder le secret
        </button>
      </form>
    </div>
  )
}

export default Secret