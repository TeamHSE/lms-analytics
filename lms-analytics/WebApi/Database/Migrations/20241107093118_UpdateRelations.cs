using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Disciplines_DisciplineId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_DisciplineId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "DisciplineId",
                table: "Students");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "StudyGroups",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Students",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StudyGroupId",
                table: "Students",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DisciplineStudent",
                columns: table => new
                {
                    DisciplinesId = table.Column<int>(type: "INTEGER", nullable: false),
                    StudentsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DisciplineStudent", x => new { x.DisciplinesId, x.StudentsId });
                    table.ForeignKey(
                        name: "FK_DisciplineStudent_Disciplines_DisciplinesId",
                        column: x => x.DisciplinesId,
                        principalTable: "Disciplines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DisciplineStudent_Students_StudentsId",
                        column: x => x.StudentsId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ManagerStudyGroup",
                columns: table => new
                {
                    ManagersId = table.Column<int>(type: "INTEGER", nullable: false),
                    StudyGroupsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManagerStudyGroup", x => new { x.ManagersId, x.StudyGroupsId });
                    table.ForeignKey(
                        name: "FK_ManagerStudyGroup_Managers_ManagersId",
                        column: x => x.ManagersId,
                        principalTable: "Managers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ManagerStudyGroup_StudyGroups_StudyGroupsId",
                        column: x => x.StudyGroupsId,
                        principalTable: "StudyGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudyGroups_CompanyId",
                table: "StudyGroups",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_CompanyId",
                table: "Students",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_StudyGroupId",
                table: "Students",
                column: "StudyGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_DisciplineStudent_StudentsId",
                table: "DisciplineStudent",
                column: "StudentsId");

            migrationBuilder.CreateIndex(
                name: "IX_ManagerStudyGroup_StudyGroupsId",
                table: "ManagerStudyGroup",
                column: "StudyGroupsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Companies_CompanyId",
                table: "Students",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_StudyGroups_StudyGroupId",
                table: "Students",
                column: "StudyGroupId",
                principalTable: "StudyGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudyGroups_Companies_CompanyId",
                table: "StudyGroups",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Companies_CompanyId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_StudyGroups_StudyGroupId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_StudyGroups_Companies_CompanyId",
                table: "StudyGroups");

            migrationBuilder.DropTable(
                name: "DisciplineStudent");

            migrationBuilder.DropTable(
                name: "ManagerStudyGroup");

            migrationBuilder.DropIndex(
                name: "IX_StudyGroups_CompanyId",
                table: "StudyGroups");

            migrationBuilder.DropIndex(
                name: "IX_Students_CompanyId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_StudyGroupId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "StudyGroups");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "StudyGroupId",
                table: "Students");

            migrationBuilder.AddColumn<int>(
                name: "DisciplineId",
                table: "Students",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_DisciplineId",
                table: "Students",
                column: "DisciplineId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Disciplines_DisciplineId",
                table: "Students",
                column: "DisciplineId",
                principalTable: "Disciplines",
                principalColumn: "Id");
        }
    }
}
