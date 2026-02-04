import React from "react";

type AvatarProps = {
  src?: string; // URL de l'image de l'utilisateur
  alt?: string;
  size?: string; // taille optionnelle (ex: "w-16 h-16")
};

const Avatar: React.FC<AvatarProps> = ({ src, alt = "avatar", size = "w-16 h-16" }) => {
  const defaultImage = "/assets/default-avatar.png"; // chemin vers image par défaut

  return (
    <img
      src={src || defaultImage}
      alt={alt}
      className={`rounded-full object-cover ${size}`}
    />
  );
};

export default Avatar;
