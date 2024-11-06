using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class UserRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lastname",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "Lastname",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Lastname",
                table: "Managers");

            migrationBuilder.RenameColumn(
                name: "Companyname",
                table: "Companies",
                newName: "Name");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Teachers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FatherName",
                table: "Teachers",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "Teachers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DisciplineId",
                table: "Students",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FatherName",
                table: "Students",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AdminId",
                table: "Managers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Managers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FatherName",
                table: "Managers",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AdminId",
                table: "Companies",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Surname = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    FatherName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Disciplines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CompanyId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false),
                    ManagerId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disciplines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Disciplines_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Disciplines_Managers_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Managers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DisciplineTeacher",
                columns: table => new
                {
                    DisciplinesId = table.Column<int>(type: "INTEGER", nullable: false),
                    TeachersId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DisciplineTeacher", x => new { x.DisciplinesId, x.TeachersId });
                    table.ForeignKey(
                        name: "FK_DisciplineTeacher_Disciplines_DisciplinesId",
                        column: x => x.DisciplinesId,
                        principalTable: "Disciplines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DisciplineTeacher_Teachers_TeachersId",
                        column: x => x.TeachersId,
                        principalTable: "Teachers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Teachers_CompanyId",
                table: "Teachers",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Teachers_ManagerId",
                table: "Teachers",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_DisciplineId",
                table: "Students",
                column: "DisciplineId");

            migrationBuilder.CreateIndex(
                name: "IX_Managers_AdminId",
                table: "Managers",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_Managers_CompanyId",
                table: "Managers",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_AdminId",
                table: "Companies",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_Disciplines_CompanyId",
                table: "Disciplines",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Disciplines_ManagerId",
                table: "Disciplines",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_DisciplineTeacher_TeachersId",
                table: "DisciplineTeacher",
                column: "TeachersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_Admins_AdminId",
                table: "Companies",
                column: "AdminId",
                principalTable: "Admins",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Managers_Admins_AdminId",
                table: "Managers",
                column: "AdminId",
                principalTable: "Admins",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Managers_Companies_CompanyId",
                table: "Managers",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Disciplines_DisciplineId",
                table: "Students",
                column: "DisciplineId",
                principalTable: "Disciplines",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Teachers_Companies_CompanyId",
                table: "Teachers",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teachers_Managers_ManagerId",
                table: "Teachers",
                column: "ManagerId",
                principalTable: "Managers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Companies_Admins_AdminId",
                table: "Companies");

            migrationBuilder.DropForeignKey(
                name: "FK_Managers_Admins_AdminId",
                table: "Managers");

            migrationBuilder.DropForeignKey(
                name: "FK_Managers_Companies_CompanyId",
                table: "Managers");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Disciplines_DisciplineId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Teachers_Companies_CompanyId",
                table: "Teachers");

            migrationBuilder.DropForeignKey(
                name: "FK_Teachers_Managers_ManagerId",
                table: "Teachers");

            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "DisciplineTeacher");

            migrationBuilder.DropTable(
                name: "Disciplines");

            migrationBuilder.DropIndex(
                name: "IX_Teachers_CompanyId",
                table: "Teachers");

            migrationBuilder.DropIndex(
                name: "IX_Teachers_ManagerId",
                table: "Teachers");

            migrationBuilder.DropIndex(
                name: "IX_Students_DisciplineId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Managers_AdminId",
                table: "Managers");

            migrationBuilder.DropIndex(
                name: "IX_Managers_CompanyId",
                table: "Managers");

            migrationBuilder.DropIndex(
                name: "IX_Companies_AdminId",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "FatherName",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "DisciplineId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "FatherName",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Managers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Managers");

            migrationBuilder.DropColumn(
                name: "FatherName",
                table: "Managers");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Companies",
                newName: "Companyname");

            migrationBuilder.AddColumn<string>(
                name: "Lastname",
                table: "Teachers",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Lastname",
                table: "Students",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Lastname",
                table: "Managers",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");
        }
    }
}
