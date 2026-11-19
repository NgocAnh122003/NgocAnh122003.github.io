using Dvna.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<DocumentGroup> DocumentGroups => Set<DocumentGroup>();
    public DbSet<DocumentItem> DocumentItems => Set<DocumentItem>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Registration> Registrations => Set<Registration>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<AdminUser>(e =>
        {
            e.HasIndex(x => x.Username).IsUnique();
            e.Property(x => x.Username).HasMaxLength(50);
            e.Property(x => x.PasswordHash).HasMaxLength(200);
        });

        b.Entity<Course>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(150);
            e.Property(x => x.Level).HasMaxLength(50);
            e.Property(x => x.Icon).HasMaxLength(20);
            e.Property(x => x.Color).HasMaxLength(20);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.Price).HasMaxLength(100);
            e.Property(x => x.Schedule).HasMaxLength(150);
            e.Property(x => x.Format).HasMaxLength(150);
        });

        b.Entity<DocumentGroup>(e =>
        {
            e.HasIndex(x => x.Key).IsUnique();
            e.Property(x => x.Key).HasMaxLength(50);
            e.Property(x => x.Label).HasMaxLength(100);
            e.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.DocumentGroupId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<DocumentItem>(e =>
        {
            e.Property(x => x.Subject).HasMaxLength(100);
            e.Property(x => x.Icon).HasMaxLength(20);
            e.Property(x => x.Color).HasMaxLength(20);
            e.Property(x => x.Link).HasMaxLength(500);
        });

        b.Entity<Testimonial>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(100);
            e.Property(x => x.Role).HasMaxLength(100);
            e.Property(x => x.Content).HasMaxLength(1000);
        });

        b.Entity<Registration>(e =>
        {
            e.Property(x => x.StudentName).HasMaxLength(100);
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.Grade).HasMaxLength(20);
            e.Property(x => x.Message).HasMaxLength(1000);
            e.Property(x => x.Note).HasMaxLength(1000);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            // Lưu theo giờ UTC (timestamptz) — trình duyệt tự đổi sang giờ Việt Nam
            e.HasIndex(x => x.CreatedAt);
        });
    }
}
