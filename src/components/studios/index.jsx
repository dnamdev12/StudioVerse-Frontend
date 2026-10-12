import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fileUrl, getStudios } from "../../api";
import "./studios.css";

const Studios = () => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudios()
      .then((data) => setStudios(data.studios))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="studio-page">
      <div className="studio-list-header">
        <div>
          <h1 className="studio-title">Studio Management</h1>
          <p className="studio-muted">
            {loading ? "Loading..." : `${studios.length} studio${studios.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link to="/studios/create" className="studio-btn studio-btn--primary">
          + Add Studio
        </Link>
      </div>

      {!loading && studios.length === 0 && (
        <div className="studio-empty">
          <p>No studios yet.</p>
          <Link to="/studios/create">Add your first studio</Link>
        </div>
      )}

      <div className="studio-cards">
        {studios.map((studio) => (
          <article key={studio._id} className="studio-card">
            <div className="studio-card-image">
              {studio.image ? (
                <img src={fileUrl(studio.image.url)} alt={studio.name} />
              ) : (
                <span>No image</span>
              )}
            </div>
            <div className="studio-card-body">
              <h2>{studio.name}</h2>
              <p className="studio-muted">
                {studio.address.city}, {studio.address.state}
              </p>
              <Link to={`/studios/${studio._id}/edit`} className="studio-btn studio-btn--outline studio-btn--sm">
                Edit
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Studios;
