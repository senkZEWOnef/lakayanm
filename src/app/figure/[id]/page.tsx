import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

async function getFigureData(id: string) {
  const figure = await prisma.figures.findUnique({
    where: { id, is_published: true },
    include: {
      city: {
        include: {
          department: true
        }
      }
    }
  });

  if (!figure) return null;

  return figure;
}

export default async function FigurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const figure = await getFigureData(id);
  
  if (!figure) {
    notFound();
  }

  // Parse JSON fields safely
  let livedAddresses: string[] = [];
  let quotes: string[] = [];
  let monuments: string[] = [];
  let achievements: string[] = [];

  try {
    if (figure.lived_addresses) livedAddresses = JSON.parse(figure.lived_addresses);
    if (figure.quotes) quotes = JSON.parse(figure.quotes);
    if (figure.monuments) monuments = JSON.parse(figure.monuments);
    if (figure.achievements) achievements = JSON.parse(figure.achievements);
  } catch (error) {
    console.error('Error parsing JSON fields:', error);
  }

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="text-sm">
        <Link href="/" className="text-brand hover:text-brand-dark">Home</Link>
        <span className="mx-2 text-gray-400">→</span>
        <Link href={`/dept/${figure.city.department.slug}`} className="text-brand hover:text-brand-dark">
          {figure.city.department.name}
        </Link>
        <span className="mx-2 text-gray-400">→</span>
        <Link href={`/dept/${figure.city.department.slug}/city/${figure.city.slug}`} className="text-brand hover:text-brand-dark">
          {figure.city.name}
        </Link>
        <span className="mx-2 text-gray-400">→</span>
        <span className="text-gray-600">{figure.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="card bg-gradient-to-r from-haiti-navy/5 to-brand/5 dark:from-haiti-navy/10 dark:to-brand/10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Portrait */}
          {figure.portrait_url && (
            <div className="relative w-48 h-64 mx-auto md:mx-0 flex-shrink-0">
              <Image 
                src={figure.portrait_url} 
                alt={figure.name} 
                fill 
                className="object-cover rounded-xl border-4 border-brand/20" 
                sizes="192px"
              />
            </div>
          )}
          
          {/* Basic Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">
              {figure.name}
            </h1>
            {figure.full_name && figure.full_name !== figure.name && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                <em>{figure.full_name}</em>
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-4">
              {(figure.birth_year || figure.death_year) && (
                <span className="text-lg text-haiti-teal font-medium">
                  📅 {figure.birth_year} - {figure.death_year}
                </span>
              )}
              {figure.category && (
                <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium">
                  {figure.category}
                </span>
              )}
            </div>

            <div className="text-haiti-coral mb-4">
              📍 From {figure.city.name}, {figure.city.department.name}
            </div>

            {figure.bio && (
              <p className="text-lg leading-relaxed sub">
                {figure.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Life Timeline */}
      {livedAddresses.length > 0 && (
        <section className="card border-l-4 border-haiti-teal">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6 flex items-center gap-2">
            🏠 Places of Residence
          </h2>
          <div className="space-y-3">
            {livedAddresses.map((address, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-haiti-teal rounded-full mt-2 flex-shrink-0"></div>
                <p className="sub">{address}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="card border-l-4 border-brand">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6 flex items-center gap-2">
            🏆 Major Achievements
          </h2>
          <div className="grid gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-brand/5 rounded-xl">
                <div className="text-brand text-xl">✓</div>
                <p className="sub">{achievement}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Famous Quotes */}
      {quotes.length > 0 && (
        <section className="card bg-gradient-to-r from-haiti-amber/5 to-haiti-coral/5 dark:from-haiti-amber/10 dark:to-haiti-coral/10 border-haiti-amber/20">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6 flex items-center gap-2">
            💭 Famous Quotes
          </h2>
          <div className="space-y-6">
            {quotes.map((quote, index) => (
              <blockquote key={index} className="relative">
                <div className="text-6xl text-haiti-amber/30 absolute -top-4 -left-2">&ldquo;</div>
                <p className="text-lg italic text-haiti-navy dark:text-haiti-turquoise pl-8 leading-relaxed">
                  {quote}
                </p>
                <div className="text-right mt-2 text-brand font-medium">
                  — {figure.name}
                </div>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Monuments & Legacy */}
      {monuments.length > 0 && (
        <section className="card border-l-4 border-haiti-coral">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6 flex items-center gap-2">
            🏛️ Monuments & Legacy
          </h2>
          <div className="space-y-4">
            {monuments.map((monument, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-haiti-coral/5 rounded-xl">
                <div className="text-haiti-coral text-xl">🏛️</div>
                <p className="sub">{monument}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {figure.movements && (
          <div className="card border-l-4 border-haiti-emerald">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-3 flex items-center gap-2">
              ⚡ Movements
            </h3>
            <p className="sub">{figure.movements}</p>
          </div>
        )}

        {figure.occupation && (
          <div className="card border-l-4 border-haiti-emerald">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-3 flex items-center gap-2">
              💼 Occupation
            </h3>
            <p className="sub">{figure.occupation}</p>
          </div>
        )}
      </div>

      {/* Back to City */}
      <div className="text-center">
        <Link 
          href={`/dept/${figure.city.department.slug}/city/${figure.city.slug}`}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          ← Back to {figure.city.name}
        </Link>
      </div>
    </div>
  );
}