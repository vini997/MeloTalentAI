using MeloTalentAI.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MeloTalentAI.Api.Infrastructure.Persistence;

public class TalentAiDbContext(DbContextOptions<TalentAiDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<Resume> Resumes => Set<Resume>();

    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    public DbSet<JobAnalysis> JobAnalyses => Set<JobAnalysis>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(user => user.Email)
            .HasMaxLength(320);

        modelBuilder.Entity<JobApplication>()
            .Property(application => application.Status)
            .HasConversion<string>();

        modelBuilder.Entity<JobApplication>()
            .HasOne(application => application.Analysis)
            .WithOne(analysis => analysis.JobApplication)
            .HasForeignKey<JobAnalysis>(analysis => analysis.JobApplicationId);

        modelBuilder.Entity<JobApplication>()
            .HasOne(application => application.Resume)
            .WithMany(resume => resume.JobApplications)
            .HasForeignKey(application => application.ResumeId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
