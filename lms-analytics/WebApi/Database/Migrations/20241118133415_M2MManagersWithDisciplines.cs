using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class M2MManagersWithDisciplines : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Disciplines_Managers_ManagerId",
                table: "Disciplines");

            migrationBuilder.DropIndex(
                name: "IX_Disciplines_ManagerId",
                table: "Disciplines");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Disciplines");

            migrationBuilder.CreateTable(
                name: "DisciplineManager",
                columns: table => new
                {
                    DisciplinesId = table.Column<int>(type: "INTEGER", nullable: false),
                    ManagersId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DisciplineManager", x => new { x.DisciplinesId, x.ManagersId });
                    table.ForeignKey(
                        name: "FK_DisciplineManager_Disciplines_DisciplinesId",
                        column: x => x.DisciplinesId,
                        principalTable: "Disciplines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DisciplineManager_Managers_ManagersId",
                        column: x => x.ManagersId,
                        principalTable: "Managers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DisciplineManager_ManagersId",
                table: "DisciplineManager",
                column: "ManagersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DisciplineManager");

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "Disciplines",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Disciplines_ManagerId",
                table: "Disciplines",
                column: "ManagerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Disciplines_Managers_ManagerId",
                table: "Disciplines",
                column: "ManagerId",
                principalTable: "Managers",
                principalColumn: "Id");
        }
    }
}
