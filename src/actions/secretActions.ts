// Indique que ce fichier contient des actions serveur Next.js
// Ces fonctions ne s'exécuteront que côté serveur
'use server'

// Importation des dépendances nécessaires
// currentUser : permet d'obtenir l'utilisateur actuellement connecté via Clerk
// prisma : notre client de base de données
// CryptoJS : bibliothèque de cryptographie
import { currentUser } from "@clerk/nextjs/server";
import prisma from '@/lib/db'
import CryptoJS from 'crypto-js'

/**
 * Fonction utilitaire qui chiffre un texte donné
 * @param text - Le texte à chiffrer
 * @returns Le texte chiffré sous forme de chaîne
 * 
 * Utilise l'algorithme AES (Advanced Encryption Standard)
 * process.env.ENCRYPTION_KEY! : la clé de chiffrement stockée dans les variables d'environnement
 * Le '!' indique à TypeScript que nous sommes sûrs que la clé existe
 */
const encryptSecret = (text: string) => {
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY!).toString();
}

/**
 * Fonction utilitaire qui déchiffre un texte chiffré
 * @param ciphertext - Le texte chiffré à déchiffrer
 * @returns Le texte original déchiffré
 * 
 * 1. Déchiffre d'abord le texte en bytes
 * 2. Convertit les bytes en chaîne UTF8 lisible
 */
const decryptSecret = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY!);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Action serveur pour créer ou mettre à jour un secret
 * @param content - Le contenu du secret à sauvegarder
 * @returns Un objet indiquant le succès ou l'échec de l'opération
 * 
 * Processus :
 * 1. Vérifie que l'utilisateur est connecté
 * 2. Chiffre le contenu
 * 3. Utilise upsert pour créer ou mettre à jour le secret en base de données
 *    - Si un secret existe pour cet utilisateur : mise à jour
 *    - Sinon : création
 */
export async function createSecret(content: string) {
  try {
    // Récupère l'utilisateur connecté
    const user = await currentUser();
    // Vérifie que l'utilisateur existe et a un ID
    if (!user?.id) throw new Error('Not authorized')

    // Chiffre le contenu avant de le stocker
    const encryptedContent = encryptSecret(content);

    // Crée ou met à jour le secret en base de données
    await prisma.secret.upsert({
      where: { userId: user.id },  // Recherche par userId
      update: { content: encryptedContent },  // Si trouvé, met à jour
      create: { userId: user.id, content: encryptedContent }  // Si non trouvé, crée
    })
    return { success: true }
  } catch (error) {
    // En cas d'erreur, retourne l'erreur avec le message
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

/**
 * Action serveur pour récupérer le secret d'un utilisateur
 * @returns Un objet contenant le secret déchiffré ou une erreur
 * 
 * Processus :
 * 1. Vérifie que l'utilisateur est connecté
 * 2. Récupère le secret chiffré depuis la base de données
 * 3. Déchiffre le secret si trouvé
 */
export async function getSecret() {
  try {
    // Récupère l'utilisateur connecté
    const user = await currentUser();
    // Vérifie que l'utilisateur existe et a un ID
    if (!user?.id) throw new Error('Not authorized')

    // Recherche le secret en base de données
    const secret = await prisma.secret.findUnique({
      where: { userId: user.id }
    })

    // Déchiffre le contenu si un secret existe, sinon renvoie une chaîne vide
    const decryptedContent = secret ? decryptSecret(secret.content) : '';
    return { success: true, content: decryptedContent }
  } catch (error) {
    // En cas d'erreur, retourne l'erreur avec le message
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}